//页面渲染
export class Render{
    constructor(){
        this.cellContainer=document.querySelector('.cell-container');
        this.scoreElement=document.querySelector('.now .value');
        this.bestElement=document.querySelector('.best .value');
        this.winOverlayer=document.querySelector('.win-overlayer');
        this.loseOverlayer=document.querySelector('.lose-overlayer');
    }
    //渲染胜利页面
    showWin(){
        if(this.winOverlayer){
        this.winOverlayer.style.display='flex';
    }}
    //隐藏胜利页面
    hideWin(){
        this.winOverlayer.style.display='none';
    }
    //渲染失败页面
    showLose(){
        this.loseOverlayer.style.display='flex';
    }
    //隐藏失败页面
    hideLose(){
        this.loseOverlayer.style.display='none';
    }
    //渲染score
    updateScore(score){
        if(this.scoreElement){
            this.scoreElement.textContent=score;
        }
    }
    //渲染bestscore
    updateBest(best){
        this.bestElement.textContent=best;
    }
    //清空所有渲染
    empty(){
        if(this.cellContainer){
            this.cellContainer.innerHTML='';
        }
    }
    //渲染grid
render(newgrid,oldgrid=null){
this.empty();
for(let row=0;row<newgrid.size;row++){
            for(let column=0;column<newgrid.size;column++){
                const tile=newgrid.cells[row][column];
                if(!tile){continue;}
                let oldrow=null;
                let oldcol=null;
                if(oldgrid){
                    for(let r=0;r<oldgrid.size;r++){
                        for(let c=0;c<oldgrid.size;c++){
                            if(oldgrid.cells[r][c]===tile){
                                oldrow=r;
                                oldcol=c;
                                break;
                            }
                        }
                        if(oldrow!=null){
                            break;
                        }
                        }}
                    this.rendercell(tile, row, column, oldrow, oldcol);
                
            }
        }}
        //渲染一个方格
rendercell(cell,newrow,newcol,oldrow=null,oldcol=null){
    const cellinner=document.createElement('div');
    cellinner.setAttribute('class','cell-inner');
    cellinner.innerHTML=cell.value;
    const celldom=document.createElement('div');
    celldom.setAttribute('class','cell');
    celldom.classList.add(`cell-${cell.value}`);
    celldom.appendChild(cellinner);
    if(oldrow!=null&&oldcol!=null){
         celldom.classList.add(`cell-position-${oldrow+1}-${oldcol+1}`);
            }
     else{
          celldom.classList.add(`cell-position-${newrow + 1}-${newcol + 1}`);
         }
          this.cellContainer.appendChild(celldom);
     if(oldrow==null||oldcol==null){
             celldom.classList.add('cell-new');
                    }
    if(cell.merged){
                        celldom.classList.add('cell-merged');
                    }
    //移动滑动逻辑
     if(oldrow!=null&&oldcol!=null){
          if(oldcol!=newcol||oldrow!=newrow){
                            requestAnimationFrame(()=>{
                                requestAnimationFrame(()=>{
                                  celldom.classList.remove(`cell-position-${oldrow + 1}-${oldcol + 1}`);
                                  celldom.classList.add(`cell-position-${newrow + 1}-${newcol + 1}`);  
                                });
                            });
                        }
                    }
}
}