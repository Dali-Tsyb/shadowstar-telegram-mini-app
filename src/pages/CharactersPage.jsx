import "../assets/css/characters.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useRef, useState } from "react";
import backArrowIcon from "../assets/images/back-arrow.svg";
import CharacterCard from "../components/CharacterCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
   deleteCharacter,
   selectCharacter,
   setCharacters,
} from "../store/slices/characterSlice.js";
import CreateCharacterCard from "../components/CreateCharacterCard.jsx";
import { addCharacter } from "../store/slices/characterSlice";
import DeleteCharacterModal from "../components/DeleteCharacterModal.jsx";
import { Link } from "react-router-dom";
import { EffectCreative } from "swiper/modules";
import "swiper/css/effect-creative";

export default function CharacterPage() {
   const dispatch = useDispatch();
   //slider
   const swiperRef = useRef(null);
   const [activeIndex, setActiveIndex] = useState(0);

   //edit mode
   const [editMode, setEditMode] = useState(false);

   //characters
   const characters = useSelector((state) => state.character.charactersList);
   //selected character
   const selectedCharacter = useSelector(
      (state) => state.character.selectedCharacter
   );
   //set selected character
   const handleSelect = () => {
      dispatch(selectCharacter(characters[activeIndex]));
   };

   //add default character
   const handleAddCharacter = () => {
      setEditMode(true);
      dispatch(setCharacters([...characters, { name: "" }]));
      setTimeout(() => {
         while (
            swiperRef.current &&
            swiperRef.current.realIndex < swiperRef.current.slides.length - 1
         ) {
            swiperRef.current.slideNext();
         }
      }, 100);
   };
   //stop character creation and remove default character
   const handleStopCreation = () => {
      setEditMode(false);
      dispatch(setCharacters(characters.slice(0, -1)));
   };

   //send new character to backend
   const handleSendCharacter = (form) => {
      dispatch(addCharacter(form));
      setEditMode(false);
      setTimeout(() => {
         while (
            swiperRef.current &&
            swiperRef.current.realIndex < swiperRef.current.slides?.length - 1
         ) {
            swiperRef.current.slideNext();
         }
      }, 200);
   };

   //delete character
   const handleDeleteCharacter = (id) => {
      dispatch(deleteCharacter(id));
   };

   return (
      <>
         <div className="d-flex flex-column justify-content-center align-items-center h-100 position-relative">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center px-4 header-btns">
               <Link to="/">
                  <button className="base-button brown-bg rounded">
                     <img className="w-100" src={backArrowIcon} alt="back" />
                  </button>
               </Link>

               {!editMode && (
                  <button
                     className="base-button brown-bg beige-text rounded"
                     role="button"
                     tabIndex="0"
                     onClick={handleAddCharacter}
                  >
                     + Новый персонаж
                  </button>
               )}
               {editMode &&
                  characters.length > 0 &&
                  !characters[characters.length - 1].id && (
                     <button
                        className="base-button beige-text brown-bg rounded"
                        onClick={handleStopCreation}
                     >
                        Отменить
                     </button>
                  )}
            </div>
            {/* LOADING */}
            {useSelector((state) => state.character.status) === "loading" && (
               <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center brown-text fw-bold no-chars-text">
                  Загрузка...
               </div>
            )}
            {/* ERROR */}
            {useSelector((state) => state.character.status) === "failed" && (
               <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center brown-text fw-bold no-chars-text">
                  Ошибка загрузки персонажей :(
               </div>
            )}
            {/* FULFILLED & NO CHARACTERS */}
            {useSelector((state) => state.character.status) === "succeeded" &&
               characters.length === 0 && (
                  <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center brown-text fw-bold no-chars-text">
                     Создай своего первого героя, <br /> кликнув кнопку сверху!
                  </div>
               )}
            {/* FULFILLED & CHARACTERS */}
            {characters && characters.length > 0 && (
               <Swiper
                  modules={[EffectCreative]}
                  effect="creative"
                  grabCursor={true}
                  loop={false}
                  slidesPerView={1}
                  centeredSlides={true}
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  className="w-100 h-100 px-4"
                  creativeEffect={{
                     limitProgress: 2,
                     perspective: false,
                     prev: {
                        translate: ["-50%", 0, 0],
                        rotate: [0, 0, -3],
                        scale: 0.9,
                     },
                     next: {
                        translate: ["50%", 0, 0],
                        rotate: [0, 0, 3],
                        scale: 0.9,
                     },
                  }}
               >
                  {characters.map((character, index) => (
                     <SwiperSlide
                        key={index}
                        className=" w-100  character-slide"
                     >
                        {character.id && (
                           <CharacterCard
                              character={character}
                              index={index}
                              selectedCharacter={selectedCharacter}
                              setSelectedCharacter={handleSelect}
                              deleteCharacter={deleteCharacter}
                           />
                        )}
                        {editMode && !character.id && (
                           <CreateCharacterCard
                              character={character}
                              index={index}
                              sendCharacter={handleSendCharacter}
                           />
                        )}
                     </SwiperSlide>
                  ))}
               </Swiper>
            )}
            {/* DELETE MODAL */}
            <DeleteCharacterModal
               onConfirm={handleDeleteCharacter}
               id={characters[activeIndex]?.id}
            />
         </div>
      </>
   );
}
