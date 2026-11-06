import Image from 'next/image';
import logo from '@/public/upbreed-logo.svg';

// First visit in a tab: logo splash until the page has loaded (never more than ~1.5s).
const HIDE = `(function(){var s=document.getElementById('upbreed-splash');if(!s)return;try{if(sessionStorage.getItem('splash')){s.style.display='none';return}sessionStorage.setItem('splash','1')}catch(e){}var done=false;function h(){if(done)return;done=true;s.style.opacity='0';setTimeout(function(){s.style.display='none'},400)}if(document.readyState==='complete')setTimeout(h,300);else window.addEventListener('load',function(){setTimeout(h,300)});setTimeout(h,1500)})();`;

const Splash = () => (
  <>
    <div
      id="upbreed-splash"
      aria-hidden
      suppressHydrationWarning
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-[#00230F] transition-opacity duration-400"
    >
      <Image src={logo} alt="" priority className="w-40 animate-pulse md:w-48" />
      <div className="h-0.5 w-32 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 animate-[splash_1s_ease-in-out_infinite] rounded-full bg-[#D0EA50]" />
      </div>
    </div>
    <script dangerouslySetInnerHTML={{ __html: HIDE }} />
  </>
);

export default Splash;
