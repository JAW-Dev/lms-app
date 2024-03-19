// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import "../application.css";
import "core-js/web/dom-collections";
import { setupNav } from "../../js/nav";
import { setupNotices } from "../../js/notice";
import { setupSelectToggles, setupCheckboxToggles } from "../../js/select-toggle";
import { setupProgressBars } from "../../js/progress-bar";
import { setupDragDrop } from "../../js/draggable";
import { setupAccordions } from "../../js/accordion";
import { setupPrint } from "../../js/print";
import { setupInfoButtons } from "../../js/info-button";
import { setupModals } from "../../js/micromodal";

require("@rails/ujs").start();
// require('@rails/activestorage').start();
// require('../js/channels');
require("../../js/icons");

setupNav();
setupNotices();
setupSelectToggles();
setupCheckboxToggles();
setupProgressBars();
setupDragDrop();
setupAccordions();
setupPrint();
setupInfoButtons();
setupModals();
