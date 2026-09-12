'use client';
import {useEffect,useState} from 'react';
import {ChevronLeft,ChevronRight,Pause,Play} from 'lucide-react';
import {Carousel,CarouselContent,CarouselItem,type CarouselApi} from '@/components/ui/carousel';
const photos=[['venue','戶外草地證婚場地'],['venue-indoor','室內帳篷宴會區'],['venue-aerial','The White Barn 場地航拍全景']];
export function VenueGallery(){
 const [api,setApi]=useState<CarouselApi>(),[selected,setSelected]=useState(0),[paused,setPaused]=useState(false),[hover,setHover]=useState(false),[dragging,setDragging]=useState(false),[reduced,setReduced]=useState(false);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(q.matches);update();q.addEventListener('change',update);return()=>q.removeEventListener('change',update)},[]);
 useEffect(()=>{if(!api)return;const select=()=>setSelected(api.selectedScrollSnap());const down=()=>setDragging(true),up=()=>setDragging(false);select();api.on('select',select);api.on('pointerDown',down);api.on('pointerUp',up);return()=>{api.off('select',select);api.off('pointerDown',down);api.off('pointerUp',up)}},[api]);
 useEffect(()=>{if(!api||paused||hover||dragging||reduced)return;const timer=setInterval(()=>{if(!document.hidden)api.scrollNext()},3000);return()=>clearInterval(timer)},[api,paused,hover,dragging,reduced,selected]);
 return <Carousel opts={{loop:true}} setApi={setApi} className="venue-gallery" aria-label="The White Barn 場地照片" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setPaused(true)}>
 <CarouselContent className="venue-slides">{photos.map(([file,alt],i)=><CarouselItem key={file} className="venue-slide" aria-label={`${i+1} / ${photos.length}`}><img src={`./images/${file}.jpg`} alt={alt} loading="lazy" draggable={false}/></CarouselItem>)}</CarouselContent>
 <button className="gallery-arrow gallery-prev" type="button" aria-label="上一張場地照片" onClick={()=>api?.scrollPrev()}><ChevronLeft size={22}/></button><button className="gallery-arrow gallery-next" type="button" aria-label="下一張場地照片" onClick={()=>api?.scrollNext()}><ChevronRight size={22}/></button>{!reduced&&<button className="gallery-toggle" type="button" aria-label={paused?'播放相片輪播':'暫停相片輪播'} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button>}
 </Carousel>;
}
