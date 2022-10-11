function createBody(){
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
    document.getElementById("launch-button").addEventListener("click", function() {
        createGameSpace()
        document.getElementById("info-label").innerHTML="A vous de jouer"
        document.getElementById("amount_click").value="0"
    });
}

function createGameSpace(grid_size=4) {
    let grid = document.getElementById("my_grid")
    grid.innerHTML=`<table align='center' id='grid_table'><tbody id='grid_body'></tbody></table>`
    let grid_body_html_code=``
    for (let row = 0; row < grid_size; row++) {
        grid_body_html_code += `<tr id='${row}'>`
        for (let column = 0; column < grid_size; column++) {
            grid_body_html_code += `<td class='cell' row='${row}' column='${column}' number='' id='${row+"_"+column}'></td>`
        }
        grid_body_html_code += `</tr>`
    }
    document.getElementById("grid_body").innerHTML=grid_body_html_code
    myClickListener(grid_size,'cell')
    distributionNumber(grid_size)
}

function distributionNumber(grid_size=4, numberAttr="number", backgroundColor="#299") {
    var amount_data=grid_size*grid_size-1
    let chosen_place=[]
    for (let each_data = 0; each_data < amount_data; each_data++) {
        var row, column=0
        var proposition={}
        var isInBlockPart=false
        var label=each_data > 8?each_data+1:'0'+(each_data+1)
        do {
            row =Math.floor(Math.random() * grid_size)
            column =Math.floor(Math.random() * grid_size)
            proposition={"row":row, "column":column}
        }while(isInBlockPart || checkValidPlace(chosen_place,proposition))
        chosen_place.push(proposition)
        // let myCaseDom= document.getElementById(parseInt(each_data/4) +"_"+(each_data % 4))
        let myCaseDom= document.getElementById(row +"_"+column)
        myCaseDom.innerText=label
        myCaseDom.setAttribute(numberAttr, each_data+1)
        myCaseDom.style.backgroundColor=backgroundColor
    }
    return chosen_place
}

function checkValidPlace(chosen_place=[], proposition) {
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

function myClickListener(grid_size=4,myClassName="cell") {
    var cell = document.getElementsByClassName(myClassName);
    var onClickCell = function() {
        var number = this.getAttribute("number");
        var row = this.getAttribute("row")
        var column= this.getAttribute("column")
        if(checkEmptyCase(row, column,number,4)){
            this.innerHTML=""
            this.style.backgroundColor=""
            this.setAttribute("number","")
        }
        let amountWellPlaced = checkWin(grid_size,myClassName)
        updateInfoTaquin(amountWellPlaced)
        if(amountWellPlaced==15){
            alert("Vous avez gagne")
            for (var i = 0; i < cell.length; i++) {
                cell[i].removeEventListener('click', onClickCell, false);
            }
        }
    };

    for (var i = 0; i < cell.length; i++) {
        cell[i].addEventListener('click', onClickCell, false);
    }
}

function checkEmptyCase(row=0, column=0,number) {
    if(movingPlace((parseInt(row)+1)+"_"+column, number) || movingPlace((row+"_"+(parseInt(column)+1)), number) 
        || movingPlace((parseInt(row)-1)+"_"+column, number) || movingPlace((row+"_"+(parseInt(column)-1)), number)){
        return true
    }
    return false
}

function movingPlace(id,number,numberAttr="number",backgroundColor="#299"){
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

function checkWin(grid_size=4,myClassName="cell"){
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
            if(((row*grid_size)+column+1 == number))
                amountWellPlaced=amountWellPlaced +1
        }
        return amountWellPlaced
    }
}

function updateInfoTaquin(amountWellPlaced=0,labelInfoId="info-label") {
    let amountClick = document.getElementById("amount_click")
    let labelInfo = document.getElementById(labelInfoId)
    let pieceBienPlace=amountWellPlaced > 1?" pièces bien placées":" pièce bien placée"
    if(amountClick && labelInfo){
        amountClick.value = parseInt(amountClick.value) + 1
    }
    labelInfo.innerHTML=`Click No ${amountClick.value} &nbsp;&nbsp; ${amountWellPlaced} ${pieceBienPlace}`
}
createBody()
createGameSpace(4)