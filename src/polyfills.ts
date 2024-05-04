/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 */

import 'zone.js';  // Included with Angular CLI.

/***************************************************************************************************
 * APPLICATION IMPORTS
 */
import { Buffer } from 'buffer';
window.Buffer = Buffer;
// pour travailler avec les nombres infini