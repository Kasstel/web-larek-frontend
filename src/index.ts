import './scss/styles.scss';
import {Modal} from "./components/common/Modal";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {EventEmitter} from "./components/base/events";
import {API_URL, CDN_URL} from "./utils/constants";
import { ApiClient } from './components/ApiClient';
import { AppState } from './components/AppData';
import { IProduct } from './types';
const events = new EventEmitter();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const api = new ApiClient(CDN_URL, API_URL)

const appData = new AppState({}, events)

