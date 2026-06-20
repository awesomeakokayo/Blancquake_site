export class CountUpText {
  el: HTMLElement;
  scrambleDuration: number;
  chars: string;

  constructor(el: HTMLElement, { scrambleDuration = 3000, chars = '0123456789' } = {}) {
    this.el = el;
    this.scrambleDuration = scrambleDuration;
    this.chars = chars;
  }

  animate(finalValue: number) {
    const totalFrames = Math.round(this.scrambleDuration / 16);
    let frame = 0;
    const finalString = finalValue.toLocaleString();
    const finalLen = finalString.length;

    const scramble = () => {
      frame++;
      const progress = frame / totalFrames;
      const settledCount = Math.floor(progress * finalLen);
      let display = '';
      for (let i = 0; i < finalLen; i++) {
        if (finalString[i] === ',' || finalString[i] === '+') {
          display += finalString[i];
        } else if (i < settledCount) {
          display += finalString[i];
        } else {
          display += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
      }
      this.el.textContent = display;
      if (frame < totalFrames) {
        requestAnimationFrame(scramble);
      } else {
        this.el.textContent = finalString;
      }
    };
    scramble();
  }
}
