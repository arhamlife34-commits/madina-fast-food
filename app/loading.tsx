export default function Loading() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#ead6b8]">

      {/* =====================================================
          SHIMMER ANIMATION
      ===================================================== */}

      <style>{`
        @keyframes madinaShimmer {
          0% {
            background-position: -700px 0;
          }
          100% {
            background-position: 700px 0;
          }
        }

        .madina-skeleton {
          background-image: linear-gradient(
            90deg,
            rgba(255,255,255,0.035) 0%,
            rgba(255,255,255,0.10) 45%,
            rgba(255,255,255,0.035) 75%
          );
          background-size: 700px 100%;
          animation: madinaShimmer 1.8s infinite linear;
        }

        @keyframes madinaFade {
          0%, 100% {
            opacity: .72;
          }
          50% {
            opacity: 1;
          }
        }

        .madina-pulse {
          animation: madinaFade 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* =====================================================
          NAVBAR SKELETON
      ===================================================== */}

      <header
        className="
          relative
          z-50
          h-[53px]
          w-full
          border-b
          border-white/10
          bg-[#151515]
        "
      >
        <div
          className="
            mx-auto
            flex
            h-full
            w-full
            max-w-[1500px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* LEFT DELIVERY AREA */}

          <div className="flex items-center gap-2">

            <div
              className="
                madina-skeleton
                h-7
                w-7
                rounded-full
                border
                border-[#c98a27]/30
                bg-[#252525]
              "
            />

            <div className="space-y-1">

              <div
                className="
                  madina-skeleton
                  h-3
                  w-[105px]
                  rounded
                  bg-[#2a2a2a]
                "
              />

              <div
                className="
                  madina-skeleton
                  h-2
                  w-[75px]
                  rounded
                  bg-[#242424]
                "
              />

            </div>

          </div>

          {/* CENTER LOGO */}

          <div
            className="
              madina-pulse
              absolute
              left-1/2
              top-1/2
              flex
              h-[40px]
              w-[40px]
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-[#9a641f]
              bg-[#20150d]
              shadow-[0_0_15px_rgba(180,115,35,0.15)]
            "
          >
            <div
              className="
                h-[25px]
                w-[25px]
                rounded-full
                border
                border-[#75491c]
                bg-[#2c1a0d]
              "
            />
          </div>

          {/* RIGHT ACTIONS */}

          <div className="flex items-center gap-2">

            {/* MENU */}

            <div
              className="
                madina-skeleton
                flex
                h-[35px]
                w-[35px]
                items-center
                justify-center
                rounded-[9px]
                border
                border-white/10
                bg-[#242424]
              "
            >
              <div className="h-3 w-4 space-y-1">
                <div className="h-[2px] w-4 rounded bg-white/20" />
                <div className="h-[2px] w-4 rounded bg-white/20" />
                <div className="h-[2px] w-4 rounded bg-white/20" />
              </div>
            </div>

            {/* CALL BUTTON */}

            <div
              className="
                madina-skeleton
                hidden
                h-[35px]
                w-[95px]
                rounded-[9px]
                bg-[#8e1713]
                sm:block
              "
            />

            {/* CART */}

            <div
              className="
                madina-skeleton
                h-[35px]
                w-[35px]
                rounded-[9px]
                border
                border-white/10
                bg-[#242424]
              "
            />

            {/* DROPDOWN */}

            <div
              className="
                madina-skeleton
                h-[35px]
                w-[35px]
                rounded-[9px]
                border
                border-white/10
                bg-[#242424]
              "
            />

          </div>

        </div>
      </header>


      {/* =====================================================
          HERO SKELETON
      ===================================================== */}

      <section className="w-full bg-[#151515]">

        <div
          className="
            relative
            h-[235px]
            w-full
            overflow-hidden
            bg-[#111111]
            sm:h-[330px]
            lg:h-[440px]
          "
        >

          {/* MAIN HERO SHIMMER */}

          <div
            className="
              madina-skeleton
              absolute
              inset-0
              bg-[#181818]
            "
          />

          {/* SUBTLE CENTER GLOW */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-transparent
              via-black/5
              to-black/25
            "
          />

          {/* FAKE HERO CONTENT */}

          <div
            className="
              absolute
              bottom-8
              left-5
              space-y-3
              sm:left-8
              lg:left-12
            "
          >

            <div
              className="
                madina-skeleton
                h-3
                w-20
                rounded
                bg-white/10
              "
            />

            <div
              className="
                madina-skeleton
                h-7
                w-48
                rounded-md
                bg-white/10
                sm:h-9
                sm:w-64
              "
            />

            <div
              className="
                madina-skeleton
                h-3
                w-32
                rounded
                bg-white/10
              "
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          CATEGORY BAR SKELETON
      ===================================================== */}

      <section
        className="
          w-full
          border-y
          border-red-700
          bg-red-600
          shadow-[0_5px_18px_rgba(0,0,0,0.25)]
        "
      >

        <div
          className="
            flex
            h-[53px]
            w-full
            items-center
            gap-1.5
            overflow-hidden
            px-2
            sm:h-[55px]
            sm:gap-2
            sm:px-4
          "
        >

          {[
            105,
            120,
            125,
            100,
            125,
            120,
            125,
            80,
            90,
            90,
            75,
            65,
            65,
          ].map((width, index) => (
            <div
              key={index}
              className={`
                madina-skeleton
                h-[32px]
                shrink-0
                rounded-md
                ${
                  index === 0
                    ? "bg-yellow-400/70"
                    : "bg-red-700/70"
                }
              `}
              style={{
                width: `${width}px`,
              }}
            />
          ))}

        </div>

      </section>


      {/* =====================================================
          SEARCH BAR SKELETON
      ===================================================== */}

      <section className="w-full bg-white">

        <div
          className="
            mx-auto
            flex
            h-[60px]
            w-full
            max-w-7xl
            items-center
            border-b
            border-[#b8b8b8]
            px-4
            sm:h-[62px]
            sm:px-5
            lg:px-8
          "
        >

          {/* SEARCH ICON */}

          <div
            className="
              madina-skeleton
              mr-5
              h-5
              w-5
              shrink-0
              rounded-full
              bg-[#dedede]
              sm:mr-6
            "
          />

          {/* SEARCH TEXT */}

          <div
            className="
              madina-skeleton
              h-3
              w-[170px]
              rounded
              bg-[#e3e3e3]
              sm:w-[210px]
            "
          />

        </div>

      </section>


      {/* =====================================================
          MENU CONTENT
      ===================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          pb-20
          pt-8
          sm:px-5
          sm:pt-10
          lg:px-8
        "
      >

        {/* =================================================
            CATEGORY HEADING
        ================================================= */}

        <div className="mb-5">

          <div
            className="
              madina-skeleton
              mb-2
              h-3
              w-[68px]
              rounded
              bg-red-600/50
            "
          />

          <div
            className="
              madina-skeleton
              h-9
              w-[210px]
              rounded-md
              bg-[#c9ae8d]
              sm:h-10
              sm:w-[260px]
            "
          />

        </div>


        {/* =================================================
            CATEGORY POSTER
        ================================================= */}

        <div
          className="
            madina-skeleton
            mb-7
            h-[145px]
            w-full
            overflow-hidden
            rounded-2xl
            border
            border-[#c7a77e]
            bg-[#b9976d]
            shadow-[0_12px_30px_rgba(80,50,20,0.18)]
            sm:h-[210px]
            sm:rounded-3xl
            lg:h-[260px]
          "
        >

          <div
            className="
              h-full
              w-full
              bg-gradient-to-r
              from-transparent
              via-white/5
              to-transparent
            "
          />

        </div>


        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            sm:gap-5
            lg:grid-cols-4
          "
        >

          {Array.from({ length: 8 }).map(
            (_, index) => (

              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-[20px]
                  border
                  border-[#6d431e]
                  bg-[#241208]
                  p-2
                  shadow-[0_14px_35px_rgba(0,0,0,0.45)]
                  sm:rounded-[24px]
                  sm:p-2.5
                "
              >

                {/* PRODUCT IMAGE FRAME */}

                <div
                  className="
                    rounded-[16px]
                    border
                    border-[#865321]
                    bg-[#3a1c09]
                    p-1.5
                    sm:rounded-[19px]
                    sm:p-2
                  "
                >

                  <div
                    className="
                      madina-skeleton
                      aspect-square
                      w-full
                      overflow-hidden
                      rounded-[12px]
                      border
                      border-[#57300f]
                      bg-[#1b0b04]
                    "
                  />

                </div>


                {/* PRODUCT INFORMATION */}

                <div
                  className="
                    relative
                    mt-2
                    rounded-[16px]
                    border
                    border-[#75471f]
                    bg-gradient-to-br
                    from-[#45240e]
                    via-[#2b1407]
                    to-[#1f0d04]
                    px-2.5
                    pb-2.5
                    pt-3.5
                    sm:mt-2.5
                    sm:rounded-[19px]
                    sm:px-4
                    sm:pb-4
                    sm:pt-4
                  "
                >

                  {/* PRODUCT NAME */}

                  <div
                    className="
                      madina-skeleton
                      mx-auto
                      h-5
                      w-[75%]
                      rounded
                      bg-[#8a5b28]/40
                      sm:h-6
                    "
                  />

                  {/* GOLD LINE */}

                  <div className="my-3 flex items-center justify-center">

                    <div
                      className="
                        h-px
                        w-8
                        bg-[#8b5521]/60
                        sm:w-12
                      "
                    />

                    <div
                      className="
                        mx-2
                        h-1.5
                        w-1.5
                        rotate-45
                        bg-[#c88a36]/60
                      "
                    />

                    <div
                      className="
                        h-px
                        w-8
                        bg-[#8b5521]/60
                        sm:w-12
                      "
                    />

                  </div>


                  {/* DESCRIPTION */}

                  <div className="space-y-1.5">

                    <div
                      className="
                        madina-skeleton
                        mx-auto
                        h-2.5
                        w-full
                        rounded
                        bg-[#8a5b28]/30
                      "
                    />

                    <div
                      className="
                        madina-skeleton
                        mx-auto
                        h-2.5
                        w-[75%]
                        rounded
                        bg-[#8a5b28]/25
                      "
                    />

                  </div>


                  {/* PRICE + ADD */}

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      rounded-[10px]
                      border
                      border-[#603514]
                      bg-[#1b0b04]
                      p-1.5
                    "
                  >

                    {/* PRICE */}

                    <div className="flex-1">

                      <div
                        className="
                          madina-skeleton
                          h-5
                          w-14
                          rounded
                          bg-[#a96828]/40
                        "
                      />

                    </div>


                    {/* ADD BUTTON */}

                    <div
                      className="
                        madina-skeleton
                        h-8
                        w-[65px]
                        rounded-[8px]
                        bg-[#ae0c08]/55
                        sm:h-9
                        sm:w-[75px]
                      "
                    />

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </main>
  );
}