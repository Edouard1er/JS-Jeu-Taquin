class Taquin{
    constructor(taquin_size) {
		this.taquin_size=taquin_size
        this.block_place=[]
        this.chosen_place=[]
        this.neighbor_place=[]
	}

    distributionNumber() {
        var amount_data=this.taquin_size*this.taquin_size-1
        for (let each_data = 0; each_data < amount_data; each_data++) {
            var row, column=0
            var proposition={}
            var isInBlockPart=false
            var label=each_data > 8?each_data+1:'0'+(each_data+1)
            do {
                row =Math.floor(Math.random() * this.taquin_size)
                column =Math.floor(Math.random() * this.taquin_size)
                proposition={"row":row, "column":column}
                proposition=new Point (row, column, label)
            }while(isInBlockPart || this.checkValidPlace(this.chosen_place,proposition))
            this.chosen_place.push(proposition)
            
        }
        return this.chosen_place
    }

    checkValidPlace(chosen_place=[], proposition) {
        if(chosen_place.length == 0){
            return false
        }else{
            let position_test=chosen_place.filter(each_place=>
                (   
                    each_place.row == proposition.row 
                    && 
                    (each_place.column==proposition.column)
                )
            )
            if(position_test.length == 0)
                return false
            else
                return true
        }
    }
    
    
     checkEmptyCase(row=0, column=0,number) {
        if(this.movingPlace((parseInt(row)+1)+"_"+column, number) || this.movingPlace((row+"_"+(parseInt(column)+1)), number) 
            || this.movingPlace((parseInt(row)-1)+"_"+column, number) || this.movingPlace((row+"_"+(parseInt(column)-1)), number)){
            return true
        }
        return false
    }
    
     movingPlace(id,number,numberAttr="number",backgroundColor="#299"){
        let dom=document.getElementById(id)
        number=parseInt(number)
        if(dom && dom.innerText==""){
            dom.innerHTML=number> 8?number:'0'+number
            dom.style.backgroundColor=backgroundColor
            dom.setAttribute(numberAttr,number)
            return true
        }
        return false
    }
    
     checkWin(myClassName="cell"){
        let allCells=document.getElementsByClassName(myClassName)
        var amountWellPlaced=0
        if(allCells && allCells.length>1){
            let cellLength=allCells.length -1
            for (let index = 0; index < cellLength; index++) {
                const eachCell = allCells[index];
                const row = parseInt(eachCell.getAttribute("row"))
                const column = parseInt(eachCell.getAttribute("column"))
                let number = eachCell.getAttribute("number")
                if(number !="")
                    number=parseInt(number)
                if(((row*this.taquin_size)+column+1 == number))
                    amountWellPlaced=amountWellPlaced +1
            }
            return amountWellPlaced
        }
    }
    
     updateInfoTaquin(amountWellPlaced=0,labelInfoId="info-label") {
        let amountClick = document.getElementById("amount_click")
        let labelInfo = document.getElementById(labelInfoId)
        let pieceBienPlace=amountWellPlaced > 1?" pièces bien placées":" pièce bien placée"
        if(amountClick && labelInfo){
            amountClick.value = parseInt(amountClick.value) + 1
        }
        labelInfo.innerHTML=`Click No ${amountClick.value} &nbsp;&nbsp; ${amountWellPlaced} ${pieceBienPlace}`
    }
}

class TaquinSpace{
    constructor(taquin){
        this.taquin_size=taquin.taquin_size
        this.taquin=taquin
    }
    createBody(){
        document.getElementById("game-space").innerHTML=`<div id='taquin'>
            <div>
                <h1>Taquin</h1>
            </div>
            <div id="my_grid"></div>
            <div id="info">
                <input type="hidden" value="0" id="amount_click" />
                <label id='info-label'>
                    Taquin
                </label><br><br>
                <button id='launch-button'>Relancer</button>
            </div>
        </div>`
    }
    
    createGameSpace() {
        let grid = document.getElementById("my_grid")
        grid.innerHTML=`<table align='center' id='grid_table'><tbody id='grid_body'></tbody></table>`
        let grid_body_html_code=``
        for (let row = 0; row < this.taquin_size; row++) {
            grid_body_html_code += `<tr id='${row}'>`
            for (let column = 0; column < this.taquin_size; column++) {
                grid_body_html_code += `<td class='cell' row='${row}' column='${column}' number='' id='${row+"_"+column}'></td>`
            }
            grid_body_html_code += `</tr>`
        }
        document.getElementById("grid_body").innerHTML=grid_body_html_code
        this.myClickListener(this.taquin_size,'cell')
    }

    populatePoint(numberAttr="number",backgroundColor="#299"){
        this.taquin.chosen_place.forEach(item => {
            let myCaseDom= document.getElementById(item.row +"_"+item.column)
            myCaseDom.innerText=item.number
            myCaseDom.setAttribute(numberAttr, parseInt(item.number))
            myCaseDom.style.backgroundColor=backgroundColor
        })
    }

    myClickListener(myClassName="cell") {
        let that=this
        let cell = document.getElementsByClassName(myClassName);
        let onClickCell = function() {
            var number = this.getAttribute("number");
            var row = this.getAttribute("row")
            var column= this.getAttribute("column")
            if(that.taquin.checkEmptyCase(row, column,number,4)){
                this.innerHTML=""
                this.style.backgroundColor=""
                this.setAttribute("number","")
            }
            let amountWellPlaced = that.taquin.checkWin(this.taquin_size,myClassName)
            that.taquin.updateInfoTaquin(amountWellPlaced)
            if(amountWellPlaced==that.taquin.taquin_size *that.taquin.taquin_size -1){
                alert("Vous avez gagne")
                for (var i = 0; i < cell.length; i++) {
                    cell[i].removeEventListener('click', onClickCell, false);
                }
            }
        };
    
        for (let i = 0; i < cell.length; i++) {
            cell[i].addEventListener('click', onClickCell, false);
        }
    }
}

class Point{
    constructor (row, column, number){
        this.row=row
        this.column=column
        this.number=number
    }
    
    setRow(row){
        this.row=row
    }
    setColumn(column){
        this.column=column
    }
    setType(type){
        this.type=type
    }
    getNumber(taquin_size){
        return (this.row * this.taquin_size) + this.column
    }
}

class Main{
    constructor(taquin_size=4){
        if(parseInt(taquin_size)){
            let taquin = new Taquin(taquin_size)
            taquin.distributionNumber()
            let taquinSpace= new TaquinSpace(taquin)
            taquinSpace.createBody()
            taquinSpace.createGameSpace()
            taquinSpace.populatePoint()
            taquinSpace.myClickListener("cell")

            document.getElementById("launch-button").addEventListener("click", () =>{
                new Main(taquin_size)
                document.getElementById("info-label").innerHTML="A vous de jouer"
                document.getElementById("amount_click").value="0"
            });
        }
    }
}

new Main (2)