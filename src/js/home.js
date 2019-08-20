console.log('hola mundo!');
const noCambia = "Sergio";

let cambia = "@SergioDavid"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}
//promesas
const getUserAll = new Promise(function(todoBien, TodoMal){
  setTimeout(function(){
    todoBien('se acabo el tiempo');
  }, 5000)
})

const getUser = new Promise(function(todoBien, TodoMal){
  setTimeout(function(){
    todoBien('se acabo el tiempo 3');
  }, 3000)
})

// getUser
// .then(function(){
//   console.log("Todo esta bien en la vida");
// })
// .catch(function(message){
//   console.log(message);
// })

// race significa la primera promeva que termine
Promise.race([
  getUser,
  getUserAll
])
.then(function(message){
  console.log(message);
})
.catch(function(message){
  console.log(message);
})

//solicitando datos aun servidor con jquery
$.ajax('https://randomuser.me/api/sd',{
  method: 'GET',
  success: function(data) {
    console.log(data);
   },
   error: function(error){
     console.log(error);
   }
})
//solicitando datos aun servidor con javascrip vanila
fetch('https://randomuser.me/api/')
  .then(function(response){
    console.log(response)
    return response.json()
  })
  .then(function(user){
    console.log('user random', user);
  })
  .catch(function(){
    console.log('Algo fallo')
  });

//funcion asincrona

  (async function load() {
    // await
    // action
    // terror
    // animation
   async function getData(url){
      const response=await fetch(url)
      const data = await response.json();
      if(data.data.movie_count>0){
        //aqui se acaba
        return data;
      }
      else{
        //si no hay pelis aqui continua
        throw new Error('no se encontro ningunresultado');
      }
      // return data;
    }
    const $form= document.getElementById('form');
    const $home= document.getElementById('home');
    const $featuringContainer= document.getElementById('featuring');
    const BASE_API = 'https://yts.lt/api/v2/';

    function featuringTemplate(peli){
      return(
        `
        <div class="featuring">
        <div class="featuring-image">
          <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${peli.title}</p>
        </div>
       </div>
      
         `
      )
    }

    $form.addEventListener('submit', async (event)=>{
      //para que no tenga que recargar la pagina cadavez que hacemos submit
      event.preventDefault();
      function setAttribute($element, attributes){
        for(const attribute in attributes){
          $element.setAttribute(attribute, attributes[attribute]);
          
        }
      }
      $home.classList.add('search-active')
      //creacion de elementos 
      const $loader= document.createElement('img');
      setAttribute($loader,{
        src: 'src/images/loader.gif',
        height: 50,
        width: 50,
      })
      $featuringContainer.append($loader)

      //formularios
      const data = new FormData($form);
      // desestructuracion de objetos
      try{
        const {
          data:{
            movies: pelis
          }
        } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
        const HTMLString = featuringTemplate(pelis[0]);
        $featuringContainer.innerHTML= HTMLString;      

      }
      catch(error){
        alert(error.message);
        $loader.remove();
        $home.classList.remove('search-active');
      }
    });

 
    function videoItemTempalte(movie, category){
      return(
        `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
      )
    }

    function createTemplate(HTMLString){
      const $html = document.implementation.createHTMLDocument();
      $html.body.innerHTML = HTMLString;
      return $html.body.children[0];
    }

///////////////////---------RETO
    function renderPlayList(list, $container){
      list.forEach((play)=>{
        const HTMLString= playlistTemplate(play);
        const playElement = createTemplate(HTMLString);
        $container.append(playElement);
      })
    }
  
    function playlistTemplate(play){
      return(
        `
        <li class="myPlaylist-item">
        <a href="#">
          <span>
            ${play.title}
          </span>
        </a>
      </li>
  
        `
      )
    }
  
    const {data: {movies: fantasyList} } = await getData(`${BASE_API}list_movies.json?genre=fantasy&limit=10`)
    const $playContainer= document.querySelector('.myPlaylist');
    renderPlayList(fantasyList,$playContainer);
  
  
    async function getuser(url){
      const response=await fetch(url)
      const data = await response.json();
      return data;
    }
    function renderUserList(list, $container){
      list.forEach((user)=>{
        const HTMLString= userItemTemplate(user);
        const userElement= createTemplate(HTMLString);
        $container.append(userElement);
      })
    }
    function userItemTemplate(user){
      return(
        `  <li class="playlistFriends-item">
        <a href="#">
          <img src="${user.picture.thumbnail}" alt="echame la culpa" />
          <span>
            ${user.name.first} ${user.name.last}
          </span>
        </a>
      </li>`
      
      )
    }
  
  const {results: userList}=await getuser('https://randomuser.me/api/?results=10');
  const $userContainer= document.querySelector('ul');
  renderUserList(userList, $userContainer);


//////////---------FIN RETO----------////////////




  //  console.log(videoItemTempalte('src/images/platzi-video.png','platzi video'));
  
   //EVENTOS
   function addEventClick($element){
    $element.addEventListener('click', function(){
      // alert('click');
      showModal($element)
    })
   } 

  //Creacion del DOM
  function renderMovieList(list, $container, category) {
    //  actionList.data.movies

    $container.children[0].remove();
     list.forEach((movie)=>{
      const HTMLString = videoItemTempalte(movie, category);
      const movieElement = createTemplate(HTMLString)
      
      $container.append(movieElement);
      const image = movieElement.querySelector('img');
      image.addEventListener('load',(event)=>{
        event.srcElement.classList.add('fadeIn');
      })
      addEventClick(movieElement);
    })
  }

  async function cacheExist(){
    window.localStorage.getItem('actionList');
    await getData(`${BASE_API}list_movies.json?genre=action`)
  }
  const {data: {movies: actionList} } = await getData(`${BASE_API}list_movies.json?genre=action`)
  // console.log('accion',actionList,'drama', dramaList,'animation', animationList);
  window.localStorage.setItem('actionList', JSON.stringify(actionList));
  const $actionContainer= document.querySelector('#action');
  renderMovieList(actionList, $actionContainer, 'action')
  //selectores con jquery
  // const $home = $('.home .list #item')
  
  //selectores con javascript
  const {data: {movies: dramaList} } = await getData(`${BASE_API}list_movies.json?genre=drama`)
  window.localStorage.setItem('dramaList', JSON.stringify(dramaList));
  const $dramaContainer= document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');
  
  const {data: {movies: animationList} } = await getData(`${BASE_API}list_movies.json?genre=animation`)
  window.localStorage.setItem('animationList', JSON.stringify(animationList));
  const $animationContainer= document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');
  
    
    
    
    
    const $modal = document.getElementById('modal');
    const $overlay = document.getElementById('overlay');
    const $hideModal = document.getElementById('hide-modal');

    const $modalImage = $modal.querySelector('img');
    const $modalTitle = $modal.querySelector('h1');
    const $modalDescription = $modal.querySelector('p');
    
    function findById(list, id){
      return list.find(movie=>movie.id ===parseInt(id, 10))
    }
    function findMovie(id, category){
      switch(category){
        case 'action':{
          return findById(actionList,id);
        }
        case 'drama':{
          return findById(dramaList,id);
        }
        default: {
          return findById(animationList,id); 
        }
      }
    }
    function showModal($element){
      $overlay.classList.add('active');
      $modal.style.animation = 'modalIn .8s forwards';
      const id = $element.dataset.id;
      const category= $element.dataset.category;
      const data = findMovie(id,category);
      $modalImage.setAttribute('src', data.medium_cover_image);
      $modalTitle.textContent=data.title;
      $modalDescription.textContent=data.description_full;
    }
    
    $hideModal.addEventListener('click',()=>{
          $overlay.classList.remove('active');
      $modal.style.animation = 'modalOut .8s forwards';
    });
    // function hideModal(){
    //   $overlay.classList.remove('active');
    //   $modal.style.animation = 'modalOut .8s forwards';

    // }
   


  })()

 


