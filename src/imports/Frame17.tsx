import svgPaths from "./svg-gnadtnsjru";
import imgImage from "figma:asset/054dfe02e425078fdd66113858fbed2e929f9c10.png";

function StateLayer() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
            <path d={svgPaths.p2304a600} fill="var(--fill-0, #1D1B20)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
      <StateLayer />
    </div>
  );
}

function TrailingElements() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 size-[48px]" data-name="Trailing elements">
      <div className="overflow-clip relative rounded-[100px] shrink-0 size-[32px]" data-name="Avatar">
        <div className="absolute inset-0 rounded-[400px]" data-name="Image">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[400px]">
            <div className="absolute bg-[#ece6f0] inset-0 rounded-[400px]" />
            <img alt="" className="absolute max-w-none mix-blend-luminosity object-contain rounded-[400px] size-full" src={imgImage} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[69px] left-0 top-[67px] w-[352px]">
      <div className="absolute bg-white h-[69px] left-0 rounded-[7px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] top-0 w-[352px]" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium h-[40px] justify-center leading-[20px] left-[14px] text-[12px] text-black top-[35px] tracking-[0.12px] w-[219px] whitespace-pre-wrap" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="mb-0">レシーブの日</p>
        <p>跳び箱3つ，得点版お願いします</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <p className="absolute font-['MS_Gothic:Regular',sans-serif] h-[40px] leading-[24px] left-0 not-italic text-[#1d1b20] text-[24px] top-0 w-[112px] whitespace-pre-wrap">午後練</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[112px]">
      <Group />
      <div className="absolute left-[76px] overflow-clip size-[17px] top-0" data-name="edit">
        <div className="absolute inset-[12.5%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.75 12.75">
            <path d={svgPaths.p1920eb00} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[23px] left-0 top-[33px] w-[91px]">
      <div className="absolute left-[2px] overflow-clip size-[13px] top-[5px]" data-name="today">
        <div className="absolute inset-[8.33%_12.5%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.75 10.8333">
            <path d={svgPaths.p1287cc00} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium h-[23px] justify-center leading-[0] left-[18px] text-[12px] text-black top-[11.5px] tracking-[0.12px] w-[73px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">2/21(土)</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[16px] left-[88px] top-[37px] w-[107px]">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] left-[16px] text-[12px] text-black top-[8px] tracking-[0.12px] w-[91px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">12:00～15:00</p>
      </div>
      <div className="absolute left-0 size-[13px] top-px" data-name="schedule">
        <div className="absolute inset-[8.33%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.8333 10.8333">
            <path d={svgPaths.p3e666880} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute h-[33px] left-[284px] top-0 w-[71px]">
      <div className="absolute bg-[#f4f5f6] border-[#c5c5c5] border-[0.5px] border-solid h-[33px] left-0 rounded-[5px] top-0 w-[68px]" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] left-[30px] text-[#c5c5c5] text-[14px] top-[17px] tracking-[0.14px] w-[41px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">PDF</p>
      </div>
      <div className="absolute left-[7px] overflow-clip size-[16px] top-[9px]" data-name="download">
        <div className="absolute inset-[16.67%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p2e08fc00} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute h-[56px] left-0 top-0 w-[355px]">
      <Frame />
      <Frame1 />
      <Frame4 />
      <Frame10 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[22px] left-[323px] top-[6px] w-[28px]">
      <div className="absolute left-0 overflow-clip size-[22px] top-0" data-name="more_vert">
        <div className="absolute inset-[16.67%_41.67%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.66667 14.6667">
            <path d={svgPaths.p3fc9330} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] overflow-clip size-[22px] top-0" data-name="more_vert">
        <div className="absolute inset-[16.67%_41.67%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.66667 14.6667">
            <path d={svgPaths.p3fc9330} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="h-[10px] relative shrink-0 w-[34px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Clock">
        <div className="absolute inset-[8.33%]" data-name="Icon">
          <div className="absolute inset-[-9.6%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.93333 9.93333">
              <path d={svgPaths.p17332f00} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[12px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[28px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">02:00</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="h-[10px] relative shrink-0 w-[30px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Repeat">
        <div className="absolute inset-[4.17%_12.5%]" data-name="Icon">
          <div className="absolute inset-[-8.73%_-10.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.1 10.7667">
              <path d={svgPaths.p22605940} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[12px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[18px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">1 set</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[10px] relative shrink-0 w-[37px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Coffee">
        <div className="absolute inset-[4.17%_4.17%_12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-9.6%_-9.14%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.35 9.93333">
              <path d={svgPaths.p22060810} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[11px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[28px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">00 sec</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[206px] top-[12px]">
      <Frame7 />
      <Frame6 />
      <Frame5 />
    </div>
  );
}

function Frame8({ className }: { className?: string }) {
  return (
    <div className={className || "absolute h-[34px] left-0 top-[160px] w-[352px]"}>
      <div className="absolute bg-white h-[34px] left-0 rounded-[7px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] top-0 w-[352px]" />
      <div className="absolute flex h-[34px] items-center justify-center left-[323px] top-0 w-0" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[34px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 1">
                <line id="Line 1" stroke="var(--stroke-0, #C5C5C5)" x2="34" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame3 />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[12px] justify-center leading-[0] left-[5px] text-[11px] text-black top-[16px] tracking-[0.11px] w-[68px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">12:00 - 12:02</p>
      </div>
      <div className="absolute flex h-[34px] items-center justify-center left-[76px] top-0 w-0" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[34px]">
            <div className="absolute inset-[-3px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 3">
                <line id="Line 2" stroke="var(--stroke-0, black)" strokeWidth="3" x2="34" y1="1.5" y2="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium h-[19px] justify-center leading-[0] left-[85px] text-[11px] text-black top-[16.5px] tracking-[0.11px] w-[91px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">ミーティング</p>
      </div>
      <Frame16 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute h-[22px] left-[323px] top-[6px] w-[28px]">
      <div className="absolute left-0 overflow-clip size-[22px] top-0" data-name="more_vert">
        <div className="absolute inset-[16.67%_41.67%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.66667 14.6667">
            <path d={svgPaths.p3fc9330} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] overflow-clip size-[22px] top-0" data-name="more_vert">
        <div className="absolute inset-[16.67%_41.67%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.66667 14.6667">
            <path d={svgPaths.p3fc9330} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="h-[10px] relative shrink-0 w-[34px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Clock">
        <div className="absolute inset-[8.33%]" data-name="Icon">
          <div className="absolute inset-[-9.6%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.93333 9.93333">
              <path d={svgPaths.p17332f00} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[12px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[28px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">03:00</p>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="h-[10px] relative shrink-0 w-[30px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Repeat">
        <div className="absolute inset-[4.17%_12.5%]" data-name="Icon">
          <div className="absolute inset-[-8.73%_-10.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.1 10.7667">
              <path d={svgPaths.p22605940} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[12px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[18px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">1 set</p>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="h-[10px] relative shrink-0 w-[37px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Coffee">
        <div className="absolute inset-[4.17%_4.17%_12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-9.6%_-9.14%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.35 9.93333">
              <path d={svgPaths.p22060810} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[11px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[28px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">00 sec</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[206px] top-[12px]">
      <Frame12 />
      <Frame15 />
      <Frame18 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute h-[22px] left-[323px] top-[6px] w-[28px]">
      <div className="absolute left-0 overflow-clip size-[22px] top-0" data-name="more_vert">
        <div className="absolute inset-[16.67%_41.67%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.66667 14.6667">
            <path d={svgPaths.p3fc9330} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] overflow-clip size-[22px] top-0" data-name="more_vert">
        <div className="absolute inset-[16.67%_41.67%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.66667 14.6667">
            <path d={svgPaths.p3fc9330} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="h-[10px] relative shrink-0 w-[34px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Clock">
        <div className="absolute inset-[8.33%]" data-name="Icon">
          <div className="absolute inset-[-9.6%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.93333 9.93333">
              <path d={svgPaths.p17332f00} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[12px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[28px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">03:00</p>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="h-[10px] relative shrink-0 w-[30px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Repeat">
        <div className="absolute inset-[4.17%_12.5%]" data-name="Icon">
          <div className="absolute inset-[-8.73%_-10.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.1 10.7667">
              <path d={svgPaths.p22605940} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[12px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[18px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">1 set</p>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="h-[10px] relative shrink-0 w-[37px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Coffee">
        <div className="absolute inset-[4.17%_4.17%_12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-9.6%_-9.14%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.35 9.93333">
              <path d={svgPaths.p22060810} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[11px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[28px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">00 sec</p>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[206px] top-[12px]">
      <Frame21 />
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute h-[22px] left-[323px] top-[6px] w-[28px]">
      <div className="absolute left-0 overflow-clip size-[22px] top-0" data-name="more_vert">
        <div className="absolute inset-[16.67%_41.67%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.66667 14.6667">
            <path d={svgPaths.p3fc9330} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] overflow-clip size-[22px] top-0" data-name="more_vert">
        <div className="absolute inset-[16.67%_41.67%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.66667 14.6667">
            <path d={svgPaths.p3fc9330} fill="var(--fill-0, #C5C5C5)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="h-[10px] relative shrink-0 w-[34px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Clock">
        <div className="absolute inset-[8.33%]" data-name="Icon">
          <div className="absolute inset-[-9.6%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.93333 9.93333">
              <path d={svgPaths.p17332f00} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[12px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[28px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">02:00</p>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="h-[10px] relative shrink-0 w-[30px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Repeat">
        <div className="absolute inset-[4.17%_12.5%]" data-name="Icon">
          <div className="absolute inset-[-8.73%_-10.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.1 10.7667">
              <path d={svgPaths.p22605940} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[12px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[18px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">4 set</p>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="h-[10px] relative shrink-0 w-[37px]">
      <div className="absolute left-0 overflow-clip size-[10px] top-0" data-name="Coffee">
        <div className="absolute inset-[4.17%_4.17%_12.5%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-9.6%_-9.14%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.35 9.93333">
              <path d={svgPaths.p22060810} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[10px] justify-center leading-[0] left-[11px] text-[#c5c5c5] text-[8px] top-[5px] tracking-[0.08px] w-[28px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
        <p className="leading-[20px] whitespace-pre-wrap">10 sec</p>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[206px] top-[12px]">
      <Frame26 />
      <Frame27 />
      <Frame28 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute h-[429px] left-[30px] top-[78px] w-[355px]">
      <Frame2 />
      <Frame11 />
      <Frame8 />
      <div className="absolute h-[34px] left-0 top-[198px] w-[352px]">
        <div className="absolute bg-white h-[34px] left-0 rounded-[7px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] top-0 w-[352px]" />
        <div className="absolute flex h-[34px] items-center justify-center left-[323px] top-0 w-0" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
          <div className="flex-none rotate-90">
            <div className="h-0 relative w-[34px]">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 1">
                  <line id="Line 1" stroke="var(--stroke-0, #C5C5C5)" x2="34" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <Frame9 />
        <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[12px] justify-center leading-[0] left-[5px] text-[11px] text-black top-[16px] tracking-[0.11px] w-[68px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
          <p className="leading-[20px] whitespace-pre-wrap">12:02 - 12:05</p>
        </div>
        <div className="absolute flex h-[34px] items-center justify-center left-[76px] top-0 w-0" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
          <div className="flex-none rotate-90">
            <div className="h-0 relative w-[34px]">
              <div className="absolute inset-[-3px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 3">
                  <line id="Line 2" stroke="var(--stroke-0, #CB30E0)" strokeWidth="3" x2="34" y1="1.5" y2="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium h-[19px] justify-center leading-[0] left-[85px] text-[11px] text-black top-[16.5px] tracking-[0.11px] w-[91px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
          <p className="leading-[20px] whitespace-pre-wrap">ランニング</p>
        </div>
        <Frame17 />
      </div>
      <div className="absolute h-[34px] left-0 top-[236px] w-[352px]">
        <div className="absolute bg-white h-[34px] left-0 rounded-[7px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] top-0 w-[352px]" />
        <div className="absolute flex h-[34px] items-center justify-center left-[323px] top-0 w-0" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
          <div className="flex-none rotate-90">
            <div className="h-0 relative w-[34px]">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 1">
                  <line id="Line 1" stroke="var(--stroke-0, #C5C5C5)" x2="34" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <Frame19 />
        <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[12px] justify-center leading-[0] left-[5px] text-[11px] text-black top-[16px] tracking-[0.11px] w-[68px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
          <p className="leading-[20px] whitespace-pre-wrap">12:05 - 12:08</p>
        </div>
        <div className="absolute flex h-[34px] items-center justify-center left-[76px] top-0 w-0" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
          <div className="flex-none rotate-90">
            <div className="h-0 relative w-[34px]">
              <div className="absolute inset-[-3px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 3">
                  <line id="Line 2" stroke="var(--stroke-0, #CB30E0)" strokeWidth="3" x2="34" y1="1.5" y2="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium h-[19px] justify-center leading-[0] left-[85px] text-[11px] text-black top-[16.5px] tracking-[0.11px] w-[91px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
          <p className="leading-[20px] whitespace-pre-wrap">ストレッチ</p>
        </div>
        <Frame20 />
      </div>
      <div className="absolute h-[40px] left-0 top-[274px] w-[352px]">
        <div className="absolute bg-white h-[34px] left-0 rounded-[7px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_1px_3px_1px_rgba(0,0,0,0.15)] top-0 w-[352px]" />
        <div className="absolute flex h-[34px] items-center justify-center left-[323px] top-0 w-0" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
          <div className="flex-none rotate-90">
            <div className="h-0 relative w-[34px]">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 1">
                  <line id="Line 1" stroke="var(--stroke-0, #C5C5C5)" x2="34" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <Frame24 />
        <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium',sans-serif] font-medium h-[12px] justify-center leading-[0] left-[5px] text-[11px] text-black top-[16px] tracking-[0.11px] w-[68px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
          <p className="leading-[20px] whitespace-pre-wrap">12:09 - 12:18</p>
        </div>
        <div className="absolute flex h-[34px] items-center justify-center left-[76px] top-0 w-0" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
          <div className="flex-none rotate-90">
            <div className="h-0 relative w-[34px]">
              <div className="absolute inset-[-3px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 3">
                  <line id="Line 2" stroke="var(--stroke-0, black)" strokeWidth="3" x2="34" y1="1.5" y2="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="-translate-y-1/2 absolute flex flex-col font-['Roboto:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium h-[19px] justify-center leading-[0] left-[85px] text-[11px] text-black top-[16.5px] tracking-[0.11px] w-[91px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'dlig\', \'lnum\', \'pnum\'" }}>
          <p className="leading-[20px] whitespace-pre-wrap">3枚キャッチ</p>
        </div>
        <Frame25 />
      </div>
      <div className="absolute left-[147px] overflow-clip size-[59px] top-[356px]" data-name="Plus circle">
        <div className="absolute inset-[8.33%]" data-name="Icon">
          <div className="absolute inset-[-4.07%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.1667 53.1667">
              <path d={svgPaths.p2abad40} id="Icon" stroke="var(--stroke-0, #C5C5C5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Frame14() {
  return (
    <div className="relative size-full">
      <div className="absolute content-stretch flex h-[64px] items-start justify-between left-0 px-[4px] py-[8px] top-0 w-[412px]" data-name="App bar">
        <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-[-0.25px] pointer-events-none" />
        <div className="content-stretch flex items-center justify-center relative shrink-0 size-[48px]" data-name="Leading icon">
          <Content />
        </div>
        <TrailingElements />
        <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-center justify-center left-[56px] right-[56px] top-1/2" data-name="Text content">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[28px] overflow-hidden relative shrink-0 text-[#1d1b20] text-[22px] text-center text-ellipsis w-full whitespace-nowrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
            メニュー作成
          </p>
        </div>
      </div>
      <Frame13 />
    </div>
  );
}