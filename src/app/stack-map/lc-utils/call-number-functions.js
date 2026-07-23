import { sprintf } from "./sprintf.js";

// Known limitation: a bare digit sequence with no cutter letter (e.g. a
// trailing year range like "2000-2001" without a preceding cutter) can get
// misparsed into cutter_2_number by the main regex above, splitting it from
// the rest of the trimmings. Not observed in IC's collection as of 2026-07-23.

export function normalizeLC(callNumber) {
  // remove initial whitespace
  var cn = callNumber.replace(/^\s*/, "");
  // all alpha to uppercase
  cn = cn.toUpperCase();
  var re =
    /^([A-Z]{1,3})\s*(\d+)\s*\.*(\d*)\s*\.*\s*([A-Z]*)(\d*)\s*([A-Z]*)(\d*)\s*(.*)$/;
  if (cn.match(re)) {
    var bits = cn.match(re);
    var initialLetters = bits[1];
    var classNumber = bits[2];
    var decimalNumber = bits[3];
    var cutter_1_letter = bits[4];
    var cutter_1_number = bits[5];
    var cutter_2_letter = bits[6];
    var cutter_2_number = bits[7];
    var theTrimmings = bits[8];
    if (cutter_2_letter && !cutter_2_number) {
      theTrimmings = cutter_2_letter + theTrimmings;
      cutter_2_letter = "";
    }
    if (classNumber) {
      classNumber = sprintf("%5s", classNumber);
    }
    decimalNumber = sprintf("%-12s", decimalNumber);
    if (cutter_1_number) {
      cutter_1_number = " " + cutter_1_number;
    }
    if (cutter_2_letter) {
      cutter_2_letter = "   " + cutter_2_letter;
    }
    if (cutter_2_number) {
      cutter_2_number = " " + cutter_2_number;
    }
    if (theTrimmings) {
      theTrimmings = theTrimmings.replace(/(\.)(\d)/g, "$1 $2");
      theTrimmings = theTrimmings.replace(/(\d)\s*-\s*(\d)/g, "$1-$2");
      theTrimmings = theTrimmings.replace(/(\d+)/g, (match) =>
        sprintf("%5s", match)
      );
      theTrimmings = "   " + theTrimmings;
    }
    var normalized =
      initialLetters +
      classNumber +
      decimalNumber +
      cutter_1_letter +
      cutter_1_number +
      cutter_2_letter +
      cutter_2_number +
      theTrimmings;
    return normalized;
  } else {
    console.log("We have a problem: " + callNumber);
    return;
  }
}

export function sortLC() {
  var unsortedList = Array.prototype.slice.call(arguments);
  var sortedList = [];
  var normalCallNo;
  var callNumberArray = {};
  var origCallNo = "";
  for (let i = 0; i < unsortedList.length; i++) {
    origCallNo = unsortedList[i];
    normalCallNo = normalizeLC(unsortedList[i]);
    if (normalCallNo) {
      if (!callNumberArray[normalCallNo]) {
        callNumberArray[normalCallNo] = origCallNo;
      }
    }
  }
  var theKeys = Object.keys(callNumberArray);
  var sortedKeys = theKeys.sort();
  for (let j = 0; j < sortedKeys.length; j++) {
    sortedList.push(callNumberArray[sortedKeys[j]]);
  }
  return sortedList;
}
