import { Grid } from "./grid.js";
import { Render } from "./render.js";
import { Cell } from "./cell.js";
import { Listener } from "./listener.js";
export class Manager{
    constructor(size=4){
        this.size=size;
        this.win=false;
        this.winValue=2048;
        this.grid=new Grid();
        this.render=new Render();
        this.score=0;
        this.start();
        this.listener=new Listener({
            move:(direction)=>{
                this.listenerFn(direction);
            }
        , 
        restart:()=>{
            this.start(true);
        }});
    }
    //随机添加新方格
    addRandomTile(){
        console.log('addRandomTile');
        const position=this.grid.randomAvailable();
        if(!position)return ;
        const value=Math.random()<0.9?2:4;
        const tile=new Cell(position,value);
        this.grid.add(tile);
        console.log('add',tile);
    }
    //得到bestsave
    loadBestSave(){
        const saved=localStorage.getItem('bestScore');
        return saved ? parseInt(saved,10):0;
    }
    //保存bestsave
    saveBestScore(score){
        localStorage.setItem('bestScore',String(score));
    }
    //开始游戏
    start(forcenew=false){
        console.log('start');
        if(!forcenew&&this.loadGame()){
            return;
        }
        this.score=0;
        this.win=false;
        this.render.hideWin();
        this.render.hideLose();
        this.bestScore=this.loadBestSave();
        this.grid=new Grid(this.size);
        this.render.updateScore(this.score);
        this.render.updateBest(this.bestScore);
        for(let i=0;i<2;i++){
           this.addRandomTile();
        }
        this.render.render(this.grid);
        
    }
    //键盘监听事件
    listenerFn(direction){
        let move=false;
        const oldgrid=this.grid.clone();
        const vector=this.getDireactionVector(direction);
        const{rowPath,colPath}=this.getPath(vector);
        for(let row of rowPath){
            for(let column of colPath){
                const tile=this.grid.get({row,column});
                if(!tile){continue;}
                const result=this.getNearestAvailableAim({row,column},vector);
                if(result.next&&result.next.value===tile.value){
                    const merge=new Cell({row:result.next.row,column:result.next.column},tile.value*2);
                    merge.merged=true;
                    this.grid.add(merge);
                    this.grid.remove(tile);
                    this.score+=merge.value;
                    move=true;
                    if(!this.win&&merge.value>=this.winValue){
                        this.win=true;
                        this.render.showWin();  
                    }
                }
                else if(result.aim.row!=row||result.aim.column!=column){
                   tile.updatePosition(result.aim);
                   this.grid.cells[result.aim.row][result.aim.column]=tile;
                   this.grid.cells[row][column]=null;
                   move=true;
            }
          
        }
    }if(!this.grid.randomAvailable()){
         this.render.showLose();
        }
   else if(move){
        if(!this.grid.randomAvailable()){
         this.render.showLose();
        }
    else{
        this.addRandomTile();
        this.saveGame();
        this.render.render(this.grid,oldgrid);
        this.render.updateScore(this.score);
        if(this.score>this.bestScore){
            this.bestScore=this.score;
            this.saveBestScore(this.bestScore);
            this.render.updateBest(this.bestScore);
        }}
    }
}
//向量化移动方向
    getDireactionVector(direction){
        const map={
            '向上': { row:-1, column: 0 },
            '向下': { row: 1, column: 0 },
            '向左': { row: 0, column:-1 },
            '向右': { row: 0, column: 1 }
        };
        return map[direction] ||null;
    }
    //决定检查格子方向
    getPath(direction){
     let rowPath=[];
     let colPath=[];
     for(let i=0;i<this.size;i++){
        rowPath.push(i);
        colPath.push(i);
     }
     if(direction.column===1){
        colPath=colPath.reverse();
     }
     if(direction.row===1){
        rowPath=rowPath.reverse();
     }
     return { rowPath,colPath};//等价{rowPath:rowPath,colPath:copPath}
    }
    //得到移动后的位置，和下一个格子对象用于合并逻辑
    getNearestAvailableAim(aim,direction){
        const addVector=(pos,dir)=>({
            row:pos.row+dir.row,
            column:pos.column+dir.column
        });
        aim=addVector(aim,direction);
        let next=this.grid.get(aim);
        while(!this.grid.outOfRange(aim)&&!next){
            aim=addVector(aim,direction);
            next=this.grid.get(aim);
        }
        aim={
            row:aim.row-direction.row,
            column:aim.column-direction.column
        };
        return {aim,next};
    }
    //存档游戏
    saveGame(){
        const data={
            size: this.size,
            grid:this.grid.toJSON(),
            score:this.score,
            bestScore:this.bestScore
        };
        const jsonStr=JSON.stringify(data);
        localStorage.setItem('game2048',jsonStr);
    }
    //读档游戏
    loadGame(){
        const jsonStr=localStorage.getItem('game2048');
        if(!jsonStr){return false;}
        try{
            const data=JSON.parse(jsonStr);
            this.size=data.size;
            this.score=data.score;
            this.bestScore=data.bestScore;
            this.grid=new Grid(this.size);
            this.grid.fromJson(data.grid);
            this.render.updateScore(this.score);
            this.render.updateBest(this.bestScore);
            this.render.render(this.grid);
            return true;
        }
        catch(e){
            console.warn('读档失败，重新游戏');
            return false;
        }
    }
    
}