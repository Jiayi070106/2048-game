//棋盘数据管理
import { Cell } from "./cell.js";
export class Grid{
    constructor(size=4){
        this.size=size;
        this.cells=[];
        this.init(size);
    }
    //初始化棋盘
    init(size){
        for(let row=0;row<size;row++){
            this.cells.push([]);
            for(let column=0;column<size;column++){
                this.cells[row].push(null);
            }
        }
    }
    //添加格子
    add(cell){
        this.cells[cell.row][cell.column]=cell;
    }
    //得到空闲格子位置的数组
    creatEmptyGrid(){
        const available=[];
        for(let row=0;row<this.size;row++){
            for(let column=0;column<this.size;column++){
                if(this.cells[row][column]==null){
                    available.push({row,column});
                }
            }
        }return available;
    }
    //随机得到一个空闲格子位置
    randomAvailable(){
        const cells=this.creatEmptyGrid();
        if(cells.length==0){
            return null;
        }
        const index=Math.floor(Math.random()*cells.length);
        return cells[index];
    }
    //验证格子位置是否合法
    outOfRange(position){
        const {row,column}=position;
        return(
            row<0||row>=this.size||column<0||column>=this.size );
        }
        //得到格子对象
    get(position){
        if(this.outOfRange(position)){
            return null;
        }
        return this.cells[position.row][position.column];
        
    }
    //移除格子对象
    remove(tile){
        this.cells[tile.row][tile.column]=null;
    }
    //克隆棋盘
    clone(){
        const newGrid=new Grid(this.size);
        for(let row=0;row<this.size;row++){
            for(let col=0;col<this.size;col++){
                newGrid.cells[row][col]=this.cells[row][col];//浅拷贝，得到地址
            }
        }
        return newGrid;
    }
    //把棋盘格子映射到二维数组，空闲位置用0
    toJSON(){
        const result=[];
        for(let row=0;row<this.size;row++){
            const rowData=[];
            for(let col=0;col<this.size;col++){
                const tile=this.cells[row][col];
                rowData.push(tile?tile.value:0);
            }
            result.push(rowData);
        }
        return result;
    }
    //把数组映射回grid对象
    fromJson(data){
        this.cells=[];
        for(let row=0;row<this.size;row++){
            this.cells.push([]);
            for(let col=0;col<this.size;col++){
                const value=data[row][col];
                if(value==0){
                    this.cells[row].push(null);
                }
                else{
                    const cell=new Cell({row,column},value);
                    this.cells[row].push(cell);
                }
            }
        }
    }
}
