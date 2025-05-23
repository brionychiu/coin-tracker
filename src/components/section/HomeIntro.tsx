import Image from 'next/image';

export const HomeIntro = () => {
  return (
    <section className="w-full bg-system-02 p-6">
      <div className="flex items-center justify-center">
        <Image
          src="/pointer.gif"
          alt="Pointer >"
          width={100}
          height={100}
          className="h-[80px] w-[80px] sm:h-[150px] sm:w-[150px]"
          priority
        />
        <h2 className="text-center text-4xl font-bold">
          <span className="break-keep"></span>快樂記帳
          <span className="break-keep">三大矚目功能</span>{' '}
        </h2>
        <Image
          src="/pointer.gif"
          alt="Pointer >"
          width={100}
          height={100}
          className="h-[80px] w-[80px] sm:h-[150px] sm:w-[150px]"
          priority
        />
      </div>
      <div className="flex flex-col items-center justify-center pt-10 lg:flex-row lg:items-center lg:gap-12 lg:pt-0">
        <div className="mb-10 space-y-2 lg:mb-0">
          <p className="text-5xl font-bold text-yellow-01">01</p>
          <h3 className="break-keep text-4xl font-bold">3 秒記帳</h3>
          <p className="text-base font-normal">點選兩下即可記帳一筆</p>
          <p className="text-base font-normal">
            支援外幣及收據照片，出國也能輕鬆記
          </p>
        </div>
        <Image
          src="/accounting-demo.gif"
          alt="accounting-demo.gif"
          width={600}
          height={550}
          priority
          className="hidden rounded-[20px] sm:inline-block lg:w-[650px]"
        />
      </div>
      <div className="flex flex-col-reverse items-center justify-center pt-10 sm:mt-12 lg:flex-row lg:items-center lg:gap-12 lg:pt-0">
        <Image
          src="/report-demo.gif"
          alt="report-demo.gif"
          width={600}
          height={550}
          priority
          className="hidden rounded-[20px] sm:inline-block lg:w-[650px]"
        />
        <div className="mb-10 space-y-2 lg:mb-0">
          <p className="text-5xl font-bold text-blue-03">02</p>
          <h3 className="break-keep text-4xl font-bold">清晰報表</h3>
          <p className="text-base font-normal">
            詳盡多彩的報表，即時掌握收支狀況
          </p>
          <p className="text-base font-normal">
            圓餅圖直條圖隨意切換，讓你一目了然
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center pt-10 sm:mt-12 lg:flex-row lg:items-center lg:gap-12 lg:pt-0">
        <div className="mb-10 space-y-2 lg:mb-0">
          <p className="text-5xl font-bold text-red-05">03</p>
          <h3 className="break-keep text-4xl font-bold">自訂類別及帳戶</h3>
          <p className="text-base font-normal">
            自由調整類別，多款特色icon任你挑選
          </p>
          <p className="text-base font-normal">
            自訂帳戶，讓你輕鬆管理多個帳戶
          </p>
        </div>
        <Image
          src="/setting-demo.gif"
          alt="setting-demo.gif"
          width={600}
          height={550}
          priority
          className="hidden rounded-[20px] sm:inline-block lg:w-[650px]"
        />
      </div>
    </section>
  );
};
