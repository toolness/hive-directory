# Hive Directory [![Build Status](https://secure.travis-ci.org/toolness/hive-directory.png?branch=master)](http://travis-ci.org/toolness/hive-directory)

This is an experimental directory for Hive organizations.

## Prerequisites

Node 0.10.

[PhantomJS][] 1.8 or later is used to automatically run the
browser-side tests from the command-line, but this can be optionally
disabled.

## Quick Start

```
git clone git://github.com/toolness/hive-directory.git
cd hive-directory
npm install
npm test
export SPREADSHEET_URL=test/sample.json
export COOKIE_SECRET=cookie
DEBUG= ENABLE_STUBBYID= node bin/hive-directory.js
```

Then visit http://localhost:3000. Login as anyone at amnh.org to access
the site as a Hive member.

## Environment Variables

**Note:** When an environment variable is described as representing a
boolean value, if the variable exists with *any* value (even the empty
string), the boolean is true; otherwise, it's false.

* `SPREADSHEET_URL` is the URL of the spreadsheet to use. Options
  include:
    * A Google spreadsheet. Simply take the URL of the
      spreadsheet and add auth information before the hostname. Example:
      `https://USER@gmail.com:PASS@docs.google.com/spreadsheet/ccc?key=KEY`.
    * A JSON file. Simply include the path to a JSON file containing row
      data. See `test/sample.json` for an example. This is for testing
      purposes only, and the JSON file is never written to (changes made
      via the website are saved in-memory only). Example: `test/sample.json`.

* `COOKIE_SECRET` is the secret used to encrypt and sign cookies,
  to prevent tampering.

* `DEBUG` represents a boolean value. Setting this to true makes the server
  use unminified source code on the client-side, among other things.

* `ORIGIN` is the origin of the server, as it appears
  to users. If `DEBUG` is enabled, this defaults to
  `http://localhost:PORT`. Otherwise, it must be defined.

* `ENABLE_STUBBYID` represents a boolean value. If it *and* `DEBUG` are
  both true, then the [stubbyid][] persona simulator is enabled. This allows
  anyone to easily log in as anyone they want, which makes manual testing
  and debugging easier. However, it should also *never* be enabled on
  production sites, which is why `DEBUG` must also be enabled for this
  feature to work.

* `PORT` is the port that the server binds to. Defaults to 3000.

* `SSL_KEY` is the path to a private key to use for SSL. If this
  is provided, the server must be accessed over HTTPS rather
  than HTTP, and the `SSL_CERT` environment variable must also
  be defined.

* `SSL_CERT` is the path to a SSL certificate. If this
  is provided, the server must be accessed over HTTPS rather
  than HTTP, and the `SSL_KEY` environment variable must also
  be defined.

* `STATIC_ROOT` is a URL pointing to the location of static assets. If
  not provided, the app will self-host its own static assets. Note that
  this URL should *not* end with a `/`.

* `TEMPLATE_URL` is a URL pointing to the location of template files.
  If not provided, the app will load templates from the filesystem. Note
  that if this environment variable is defined, the querystring argument
  `reloadtemplates=1` must be defined in order for the templates to
  be reloaded.

## Embedding API

The public-facing view of the directory can be embedded in any web
page. Assuming the directory is hosted at example.org, just add
the following to any web page at the point where you want the directory
content to appear:

```html
<script src="http://example.org/embed.js"></script>
```

The script element will be replaced by the directory content.

## Tests

All tests can be run via `npm test`.

Individual test suites can be run via
<code>node_modules/.bin/mocha test/<em>filename</em></code>, where
*filename* is the name of the test. See [mocha(1)][] for more options.

By default, PhantomJS is used to run the browser-side tests, but they
can be skipped if the `DISABLE_PHANTOM_TESTS` environment variable is
defined.

### Test Coverage

Build/install [jscoverage][], run `make test-cov`, then open
`coverage.html` in a browser.

Coverage should always be at 100%. Pull requests that break this will
be rejected.

  [PhantomJS]: http://phantomjs.org/
  [stubbyid]: http://toolness.github.io/stubbyid/
  [mocha(1)]: http://mochajs.org/#usage
  [jscoverage]: https://github.com/visionmedia/node-jscoverage
