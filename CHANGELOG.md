### 0.2.1

* Fixed *"TypeError: Invalid attempt to destructure non-iterable instance. In order to be iterable, non-array objects
must have a [Symbol.iterator]() method."* error caused by en-US format change in IANA time zone update.

### 0.2

* Fixed a local time zone offset detection bug in Chrome 80+ caused by
[changes in Intl.DateTimeFormat](https://support.google.com/chrome/thread/29828561?hl=en) implementation.
* Added a limited IE 11 support. All local time zones there have zero offset.
* Changed distributive file format from ES6 modules to ES5-compatible transpiled scripts. Client applications no longer
need to transpile the library explicitly, i.e. they don't need to customize Babel configuration for this purpose.
* Automated documentation build.
