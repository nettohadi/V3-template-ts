import english from './english';
import japanese from './japanese';
import type LangType from './langType';
import {getLanguage} from '../helpers/url';

function getCurrentLanguage(): LangType {
    let currentLanguage = getLanguage();
    let languageFiles = {en: english, ja: japanese};

    return languageFiles[currentLanguage] || japanese;
}

export default getCurrentLanguage();