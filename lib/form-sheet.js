var _ = require('underscore');
var util = require('./util');

var DEFAULT_SHEET_NUMBER = 0;
var VALID_EMAILS_FIELD = 'validemails';
var LAST_EDITOR_FIELD = 'lasteditor';

function getSquishedNames(row) {
  return Object.keys(row).filter(function(field) {
    return (field[0] != '_' &&
            field != 'id' &&
            field != 'title' &&
            field != 'content' &&
            typeof(row[field]) == 'string');
  });
}

function getCachedRows(sheet, sheetNumber, cb) {
  sheet.cache = sheet.cache || {};

  sheet.getInfo(function(err, info) {
    if (err) return cb(err);

    var worksheet = info.worksheets[sheetNumber];
    var cache = sheet.cache[worksheet.id];

    if (cache && info.updated == cache.updated)
      return process.nextTick(cb.bind(null, null, cache.rows));

    worksheet.getRows(function(err, rows) {
      if (err) return cb(err);

      sheet.cache[worksheet.id] = {updated: info.updated, rows: rows};
      cb(null, rows);
    });
  });
}

module.exports = function getFormSheet(options, cb) {
  var self = {
    sheet: options.sheet,
    canView: false,
    editableRow: null,
    fields: [],
    rows: []
  };
  var sheetNumber = options.sheetNumber || DEFAULT_SHEET_NUMBER;
  var sheet = options.sheet;
  var email = options.email || null;

  getCachedRows(sheet, sheetNumber, function(err, rawRows) {
    if (err) return cb(err);

    var squishedFieldNames = getSquishedNames(rawRows[0]);

    squishedFieldNames.forEach(function(fieldName) {
      self.fields.push({
        id: fieldName,
        help: rawRows[0][fieldName] || null
      });
    });

    rawRows.forEach(function(rawRow, i) {
      if (i == 0) return;

      var rawRow = rawRows[i];
      var row = [];
      row.id = i-1;
      row.isEditable = false;
      row._row = rawRows[i];
      row.val = function(name) {
        var column = row.column(name);
        return column ? column.value : '';
      };
      row.column = function(name) {
        var index = squishedFieldNames.indexOf(util.squishName(name));
        if (index == -1) return null;
        return row[index];
      };
      row.save = function(cb) {
        var changedFields = 0;

        if (!row.isEditable) return process.nextTick(function() {
          cb(new Error("row is not editable"));
        });
        self.fields.forEach(function(field, i) {
          if (typeof(row[i].value) == 'string' &&
              row[i].value != row._row[field.id]) {
            row._row[field.id] = row[i].value;
            changedFields++;
          }
        });
        if (!changedFields) return process.nextTick(function() {
          cb(null, changedFields);
        });
        row._row[LAST_EDITOR_FIELD] = email;
        row._row.save(function(err) { cb(err, changedFields); });
      };
      self.fields.forEach(function(field) {
        var item = {};
        _.extend(item, field);
        item.value = rawRow[field.id];
        item.toString = function() { return this.value; };
        row.push(item);
      });
      if (email && util.doesEmailMatch(email, rawRow[VALID_EMAILS_FIELD])) {
        self.canView = true;
        self.editableRow = row;
        row.isEditable = true;
      }
      self.rows.push(row);
    });

    cb(null, self);
  });

  return self;
};

module.exports.getSquishedNames = getSquishedNames;
