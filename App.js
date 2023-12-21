let page=1;

async function api(page){
let url=`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`;
let res=await fetch(url);
let data=await res.json();
return data.results;
}

// <------on page load---->

api(page).then((result)=>{
    render(result);
});


// <-----RENDER---->

 function render(arr){  
    let localmovie=getMovie();
    let ul=document.querySelector('ul');
    ul.innerHTML="";
arr.map((obj)=>{
let {title, poster_path, release_date, vote_average, vote_count, id
}=obj;
let obj1={title, poster_path, vote_average, vote_count};

let obj2= JSON.stringify(obj1);
let ans=localmovie.some((item)=>{
    return JSON.stringify(item)===obj2
    });
    let icon=`<i class="bi bi-heart" id='${obj2}'></i>`;
    if(ans){
         icon=`<i class="bi bi-heart-fill" id='${obj2}'></i>`;
    }else{
        icon=`<i class="bi bi-heart" id='${obj2}'></i>`;
    }
console.log(title);
let path="";
if(poster_path){
 path=`https://image.tmdb.org/t/p/original/${poster_path}`;
}else{
    path=null;
}
console.log(obj);
let li=document.createElement('li');
li.className='card';
let img=document.createElement('div');
img.className='img';
let image=document.createElement('img');
image.src=path||'https://w7.pngwing.com/pngs/318/541/png-transparent-board-clapper-cut-director-making-movie-take-the-movies-icon-thumbnail.png';
img.appendChild(image);
li.appendChild(img);
let p=document.createElement('p');
p.innerHTML=`${title}`;
li.appendChild(p);
let outer=document.createElement('div');
outer.className='outer';
let div=document.createElement('div');
div.className='rating';
div.innerHTML=`<p>vote: ${vote_count}</p>
<p>Rating: ${vote_average}</p>`
outer.appendChild(div);
let divd=document.createElement('div');
divd.className='icon';
divd.innerHTML=icon;
outer.appendChild(divd);
li.appendChild(outer);

ul.appendChild(li);
})
}

// <-----pagination------>

let prev=document.getElementById('prev');
let curr=document.getElementById('curr');
let next=document.getElementById('next');
prev.disabled=true;



function previous(){
    page--;
    curr.innerHTML=`Current page: ${page}`;
    api(page).then((result)=>{
        render(result);
    });
    if(page==1){
        prev.disabled=true;
        next.disabled=false;
    }else{
        prev.disabled=false;
        next.disabled=false;
    }
}
prev.addEventListener('click', previous);


function nextpage(){
    page++;
    curr.innerHTML=`Current page: ${page}`;
    api(page).then((result)=>{
        render(result);
    });
    if(page==3){
        next.disabled=true;
        prev.disabled=false;
    }else{
        next.disabled=false;
        prev.disabled=false;
    }
}

next.addEventListener('click', nextpage);



// <-------sort tab---->


let date=document.getElementById('date');
let rate=document.getElementById('rate');

function sortByDate(arr, flag){
    let arr1=[];
    if(flag=='oldest'){
 arr1=arr.sort((a, b)=>{
let a1=new Date(a.release_date);
let b1=new Date(b.release_date);
return a1-b1;
})
}else{
     arr1=arr.sort((a, b)=>{
        let a1=new Date(a.release_date);
        let b1=new Date(b.release_date);
        return b1-a1;
})
}
return arr1;
}


document.getElementById('date').addEventListener('click', (e)=>{
    if(!e.target.className){
        console.log(e.target.className);
    e.target.innerHTML="sort by Date (latest to oldest)";
    e.target.classList.toggle('oldest');
  
    api(page).then((result)=>{
        let arr1=sortByDate(result, 'oldest');
        console.log(arr1);
        render(arr1);
    })
}else{
    e.target.classList.toggle('oldest');
    console.log(e.target.className);
    e.target.innerHTML="sort by Date (oldest to latest)";
    api(page).then((result)=>{
        let arr1=sortByDate(result, "");
        console.log(arr1);
        render(arr1);
    })
}
})

function sortByRating(){
    
api(page).then((result)=>{
   
    if(!document.getElementById('rate').className){
        document.getElementById('rate').innerHTML=` sort by rating (most to least)`;
        document.getElementById('rate').classList.toggle('least');
        let arr2= result.sort((a, b)=>{
        console.log(document.getElementById('rate').className, 'if...');
        return a.vote_average-b.vote_average;})
        render(arr2);
    }else{
       
        document.getElementById('rate').innerHTML=` sort by rating (least to most)`;
        document.getElementById('rate').classList.toggle('least');
        let arr2= result.sort((a, b)=>{
        console.log(document.getElementById('rate').className, 'if...');
        return b.vote_average-a.vote_average;})
        render(arr2);
    }
   
})
}

document.getElementById('rate').addEventListener('click', sortByRating);


// -------search movies-----


let input=document.getElementById('input');
let search=document.getElementById('search');


// let url='https://api.themoviedb.org/3/search/movie?query=Jack+Reacher&api_key=API_KEY';


function movieSearch(){
async function searchApi(){
    let url=`https://api.themoviedb.org/3/search/movie?query=${input.value}&api_key=f531333d637d0c44abc85b3e74db2186`;
let response=await fetch(url);
let data=await response.json();
console.log(data);
return data.results;
}
searchApi().then((result)=>{
    render(result);
    document.querySelector('.pagination').style.display='none';
});
}
search.addEventListener('click', movieSearch);



// <-------ALL------>


let all=document.querySelector('.all');

function allMovie(){
    all.classList.add('active');
fav.classList.remove('active');
document.querySelector('.sort').style.display='flex';
    api(page).then((result)=>{
       render(result);
    })
    document.querySelector('.pagination').style.display='flex';
}
all.addEventListener('click', allMovie);


// <----save local storage----->
{/* <i class="bi bi-heart-fill"></i> */}

function getMovie(){
    let movies=localStorage.getItem('movies')||'[]';
    return JSON.parse(movies);
}
function addMovie(obj){
    let movies = getMovie();
    movies.push(obj);
    localStorage.setItem('movies', JSON.stringify(movies));
    
}
function removeMovie(obj){
    let movies = getMovie();
    movies=movies.filter((item)=>{
        return item['title']!==obj['title'];
    });
    localStorage.setItem('movies', JSON.stringify(movies));
    
}

// https://api.themoviedb.org/3/find/{external_id}

let icons=document.querySelector('ul');
 function addfav(e){

    if(e.target.classList.contains('bi')){
        if(e.target.classList.contains('bi-heart')){
            e.target.classList.replace('bi-heart', 'bi-heart-fill');
            let {id}= e.target;
            let obj = JSON.parse(id);
            addMovie(obj); 
            console.log(obj);
        }else if(e.target.classList.contains('bi-heart-fill')){
            e.target.classList.replace('bi-heart-fill', 'bi-heart');
            let stringobj = e.target.getAttribute('id');
            let obj = JSON.parse(stringobj);
            removeMovie(obj);
        }else if(e.target.classList.contains('bi-x-square-fill')){
            let stringobj = e.target.getAttribute('id');
            let obj = JSON.parse(stringobj);
            console.log(obj);
            removeMovie(obj);
            let arr=getMovie();
            renderFav(arr)
        }
    }
}

icons.addEventListener('click', (e)=>{
    addfav(e);
})

function renderFav(arr){
    let ul=document.querySelector('ul');
    ul.innerHTML="";
arr.map((obj)=>{
let {title, poster_path, vote_average, vote_count,
}=obj;
let obj1={title, poster_path, vote_average, vote_count};
let obj2= JSON.stringify(obj1);
let path="";
if(poster_path){
 path=`https://image.tmdb.org/t/p/original/${poster_path}`;
}else{
    path=null;
}

let li=document.createElement('li');
li.className='card';
let img=document.createElement('div');
img.className='img';
let image=document.createElement('img');
image.src=path||'https://w7.pngwing.com/pngs/318/541/png-transparent-board-clapper-cut-director-making-movie-take-the-movies-icon-thumbnail.png';
img.appendChild(image);
li.appendChild(img);
let p=document.createElement('p');
p.innerHTML=`${title}`;
li.appendChild(p);
let outer=document.createElement('div');
outer.className='outer';
let div=document.createElement('div');
div.className='rating';
div.innerHTML=`<p>vote: ${vote_count}</p>
<p>Rating: ${vote_average}</p>`
outer.appendChild(div);
let divd=document.createElement('div');
divd.className='icon';
divd.innerHTML=`<i class="bi bi-x-square-fill" id='${obj2}' ></i>`;
outer.appendChild(divd);
li.appendChild(outer);

ul.appendChild(li);
})

}


let fav=document.getElementById('Favourite');
function showFav(){
all.classList.remove('active');
fav.classList.add('active');
let arr=getMovie();
renderFav(arr);
document.querySelector('.sort').style.display='none';
document.querySelector('.pagination').style.display='none';
}

fav.addEventListener('click', showFav);