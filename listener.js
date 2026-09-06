//键盘，按钮监听事件
export class Listener{
    constructor({move:moveFn,restart:restartFn}){
        this.moveFn=moveFn;
        this.restartFn=restartFn;
        this.initKey();
        this.initButton();
        this.initWinBut();
        this.initWinBut();
        this.initLosebut();
    }
    //键盘监听
    initKey(){
        window.addEventListener('keyup',(e)=>{
            e.preventDefault();//键盘监听事件，清除浏览器默认行为
            switch(e.code){
                case 'ArrowLeft':
                    this.moveFn('向左');
                    break;
                case 'ArrowUp':
                    this.moveFn('向上');
                    break;
                case 'ArrowDown':
                    this.moveFn('向下');
                    break;
                case 'ArrowRight':
                    this.moveFn('向右');
                    break;
                default:
                    return; // 按了其他键就忽略
            }
        });
    }
    //按钮监听逻辑
    initButton(){
        const btn=document.querySelector('.new-game');
            btn.addEventListener('click',()=>{
                this.restartFn();
            });
    }
    initWinBut(){
        const btn=document.querySelector('.win-overlayer button');
        btn.addEventListener('click',()=>{
            this.restartFn();
        });
    }
    initLosebut(){
        const btn=document.querySelector('.lose-overlayer button');
        btn.addEventListener('click',()=>{
            this.restartFn();
        })
    }
}