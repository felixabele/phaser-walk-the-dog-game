import Button from "./button";
import BaseLevel from "./scenes/BaseLevel";
import { getScreenCenter, setScreenText } from "./screen";

export default class SceneDisplay {
  public level: BaseLevel;

  constructor(level: BaseLevel) {
    this.level = level;
  }

  public showSuccess(nextLevel?: string) {
    const { x, y } = getScreenCenter(this.level);
    setScreenText("!!! Gewonnen !!!", this.level);
    new Button(x, y + 70, "Neustarten", this.level, () =>
      this.level.scene.restart()
    );

    if (nextLevel) {
      new Button(x, y + 120, "Nächstes Level", this.level, () =>
        this.level.scene.start(nextLevel)
      );
    }
  }

  public showGameOver() {
    const { x, y } = getScreenCenter(this.level);
    setScreenText("Game Over", this.level);
    new Button(x, y + 70, "Neustarten", this.level, () =>
      this.level.scene.restart()
    );
  }
}
