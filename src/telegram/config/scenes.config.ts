import {Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {navigationScene} from "telegram/scenes/navigation"
import {uploadFileScene} from "telegram/scenes/upload-file"
import {informAboutDebtScene} from "telegram/scenes/inform-about-debt"
import {blackListScene} from "telegram/scenes/black-list"
import {whiteListScene} from "telegram/scenes/white-list"
import {addWhiteListScene} from "telegram/scenes/add-white-list"
import {removeWhiteListScene} from "telegram/scenes/remove-white-list"
import { searchAbonentScene } from "telegram/scenes/search-abonent"

// Функции сцены
export const {enter, leave} = Scenes.Stage
// Сцены
export const scenesStage = new Scenes.Stage<AppContext>(
  [
    navigationScene,
    uploadFileScene,
    informAboutDebtScene,
    blackListScene,
    whiteListScene,
    addWhiteListScene,
    removeWhiteListScene,
    searchAbonentScene
  ],
  {
    ttl: 7200
  }
)
