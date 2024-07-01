import { RPM } from "../path.js"

const pluginName = "Typewriter";

// Typewriter plugin code - Start
let isWaiting = false;

RPM.Manager.Plugins.registerCommand(pluginName, "Show Text", (id, text, minTime, maxTime, x, y, width, height) => {
    let message = [];
    let index = 0;

    let interval = setInterval(() => {
        message.push(text[index]);
        spawnWindow(id, x, y, height, width, message.join(""));        
        index++;
        if (index >= text.length) {
            clearInterval(interval);
            isWaiting = false;
        }
    }, Math.floor(Math.random() * (maxTime - minTime + 1) + minTime));
});
// Typewriter plugin code - End

// "Multiple window boxes" plugin code by @Russo - Start
RPM.Core.WindowBox.prototype.draw = function (isChoice = false, windowDimension = this.windowDimension, contentDimension = this.contentDimension) {
    if (this.content)
        this.content.drawBehind(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);

    // Single line alteration from source code
    !!this.customWindowSkin ? this.customWindowSkin.drawBox(windowDimension, this.selected, this.bordersVisible) : RPM.Datas.Systems.getCurrentWindowSkin().drawBox(windowDimension, this.selected, this.bordersVisible);

    if (this.content) {
        if (!isChoice && this.limitContent) {
            RPM.Common.Platform.ctx.save();
            RPM.Common.Platform.ctx.beginPath();
            RPM.Common.Platform.ctx.rect(contentDimension[0], contentDimension[1] -
                RPM.Common.ScreenResolution.getScreenY(this.padding[3] / 2), contentDimension[2], contentDimension[3] + RPM.Common.ScreenResolution.getScreenY(this.padding[3]));
            RPM.Common.Platform.ctx.clip();
        }
        if (isChoice)
            this.content.drawChoice(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
        else
            this.content.draw(contentDimension[0], contentDimension[1], contentDimension[2], contentDimension[3]);
        if (!isChoice && this.limitContent)
            RPM.Common.Platform.ctx.restore();
    }
}

// Tweaked this code to be a function instead of command
function spawnWindow(id, x, y, width, height, text) {
    const value = [id, new RPM.Core.WindowBox(x, y, width, height,
        {
            content: new RPM.Graphic.Message(text.toString(), -1, 0, 0),
            padding: RPM.Core.WindowBox.VERY_SMALL_PADDING_BOX
        })];
    value[1].content.update();
    value[1].customWindowSkin = RPM.Datas.Systems.getCurrentWindowSkin();
    const p = RPM.Manager.Stack.displayedPictures;
    var ok = false;
    for (var i = 0; i < p.length; i++) {
        if (id === p[i][0]) {
            p[i] = value;
            ok = true;
            break;
        }
        else if (id < p[i][0]) {
            p.splice(i, 0, value);
            ok = true;
            break;
        }
    }
    if (!ok)
        p.push(value);
};
// "Multiple window boxes" plugin code by @Russo - End
