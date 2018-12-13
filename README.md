Smart Motion Detector using Grove sensors and Relays to drive siren.
==============================================

See [LICENSE.md](LICENSE.md) for license terms and conditions.

See also, the
[mraa library documentation](https://iotdk.intel.com/docs/master/mraa/index.html)
for details regarding supported boards and the mraa library API and the
[upm library documentation](https://iotdk.intel.com/docs/master/upm/) for
information regarding the upm sensor and actuator library APIs.

App Overview
------------

A simple Node.js application that detects motion using Grove infrared motion detector and uses the WhatsMate NodeJS API to send messages to a group or chat.

Important App Files
-------------------

* main.js
* package.json

Important Project Files
-----------------------

* README.md
* LICENSE.md
* \<project-name\>.xdk

Tested IoT Node.js Platforms
----------------------------

* [Intel® Edison Board for Arduino](http://intel.com/edison)

> See the [Intel® NUC support page](http://www.intel.com/nucsupport)
> and the [Intel Product Specifications](http://ark.intel.com/) search tool
> for detailed hardware specifications and support.

This sample can run on other IoT [Node.js](http://nodejs.org) development
platforms, but they must include the appropriate sensor hardware or have an
attached Arduino 101 board and utilize the `imraa` service. If you use an IoT
device that is not listed above you may have to make changes to the I/O
initialization and configuration code in the `cfg-app-platform.js` module
before it will work on those other platforms. See this
[device software prerequisites][1] page for help configuring the software on
your IoT device so it can be used with the Intel XDK.

[1]: https://software.intel.com/en-us/xdk/docs/target-device-software-prereqs
