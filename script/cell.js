//单个方块数据
export class Cell{
    constructor(position,value){
        this.row=position.row;
        this.column=position.column;
        this.value=value;
        this.merged=false;
    }
    updatePosition(position){
        this.row=position.row;
        this.column=position.column;
    }
}