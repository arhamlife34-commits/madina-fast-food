"use client";

import { useEffect, useState } from "react";
import {
  LocateFixed,
  ChevronDown,
  X,
} from "lucide-react";

const locations = {
  Lahore: [
    "Johar Town",
    "Wapda Town",
    "Model Town",
    "Gulberg",
    "DHA",
    "Bahria Town",
    "Township",
    "Faisal Town",
    "Garden Town",
    "Iqbal Town",
    "Sabzazar",
    "Shadman",
  ],
};

export default function LocationPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const cityRegion = "Lahore";

  const [areaSubRegion, setAreaSubRegion] =
    useState("");

  const [saving, setSaving] = useState(false);

  const [showCloseButton, setShowCloseButton] =
    useState(false);

  const [detectingLocation, setDetectingLocation] =
    useState(false);

  /* =====================================================
     OPEN POPUP
  ===================================================== */

  function openPopup() {
    const savedArea =
      localStorage.getItem(
        "selectedAreaSubRegion"
      );

    setAreaSubRegion(savedArea || "");
    setSaving(false);
    setDetectingLocation(false);
    setShowCloseButton(true);
    setIsOpen(true);
  }

  /* =====================================================
     PAGE LOAD / REFRESH + NAVBAR EVENT
  ===================================================== */

  useEffect(() => {
    const savedArea =
      localStorage.getItem(
        "selectedAreaSubRegion"
      );

    setAreaSubRegion(savedArea || "");
    setSaving(false);
    setDetectingLocation(false);

    /*
      Popup opens every time page loads/refreshes.
    */

    setShowCloseButton(false);
    setIsOpen(true);

    window.addEventListener(
      "openLocationPopup",
      openPopup
    );

    return () => {
      window.removeEventListener(
        "openLocationPopup",
        openPopup
      );
    };
  }, []);

  /* =====================================================
     CURRENT LOCATION
  ===================================================== */

  async function handleCurrentLocation() {
    if (detectingLocation || saving) {
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      alert(
        "Your browser does not support location access. Please select your delivery area manually."
      );

      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          /*
            Reverse geocoding:
            Convert GPS coordinates into a readable
            Lahore area/location.
          */

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (!response.ok) {
            throw new Error(
              "Unable to detect location."
            );
          }

          const data = await response.json();

          /*
            Collect all possible locality names returned
            by the reverse-geocoding service.
          */

          const possibleLocationNames = [
            data.city,
            data.locality,
            data.localityInfo?.administrative?.[2]
              ?.name,
            data.localityInfo?.administrative?.[3]
              ?.name,
            data.localityInfo?.administrative?.[4]
              ?.name,
            data.localityInfo?.administrative?.[5]
              ?.name,
            data.localityInfo?.administrative?.[6]
              ?.name,
          ]
            .filter(Boolean)
            .map((value) =>
              String(value).toLowerCase()
            );

          /*
            Check that the detected city is Lahore.
          */

          const detectedLahore =
            possibleLocationNames.some(
              (name) =>
                name.includes("lahore")
            ) ||
            String(data.city || "")
              .toLowerCase()
              .includes("lahore");

          if (!detectedLahore) {
            alert(
              "Your current location is outside our Lahore delivery region. Please select a Lahore delivery area manually."
            );

            setDetectingLocation(false);

            return;
          }

          /*
            Match detected location against the areas
            available in the popup.
          */

          const matchedArea =
            locations.Lahore.find(
              (area) => {
                const normalizedArea =
                  area.toLowerCase();

                return possibleLocationNames.some(
                  (name) =>
                    name.includes(
                      normalizedArea
                    ) ||
                    normalizedArea.includes(
                      name
                    )
                );
              }
            );

          /*
            If a matching Lahore area was found,
            automatically select it.
          */

          if (matchedArea) {
            setAreaSubRegion(matchedArea);

            setDetectingLocation(false);

            alert(
              `Your current location was detected as ${matchedArea}.`
            );

            return;
          }

          /*
            Lahore detected but exact area isn't one
            of the available delivery areas.
          */

          alert(
            "Your location is in Lahore, but we could not match it to one of our listed delivery areas. Please select your area manually."
          );

          setDetectingLocation(false);
        } catch (error) {
          console.error(
            "Location detection error:",
            error
          );

          alert(
            "We could not determine your delivery area automatically. Please select your area manually."
          );

          setDetectingLocation(false);
        }
      },

      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          alert(
            "Location permission was denied. Please allow location access in your browser or select your delivery area manually."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          alert(
            "Your current location could not be determined. Please select your delivery area manually."
          );
        } else if (
          error.code ===
          error.TIMEOUT
        ) {
          alert(
            "Location detection timed out. Please try again or select your delivery area manually."
          );
        } else {
          alert(
            "Unable to access your current location. Please select your delivery area manually."
          );
        }

        setDetectingLocation(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  /* =====================================================
     SELECT LOCATION
  ===================================================== */

  function selectLocation() {
    if (
      !areaSubRegion ||
      saving ||
      detectingLocation
    ) {
      return;
    }

    setSaving(true);

    localStorage.setItem(
      "orderType",
      "delivery"
    );

    localStorage.setItem(
      "selectedCityRegion",
      cityRegion
    );

    localStorage.setItem(
      "selectedAreaSubRegion",
      areaSubRegion
    );

    localStorage.setItem(
      "locationSetupCompleted",
      "true"
    );

    localStorage.removeItem(
      "pickupBranch"
    );

    localStorage.setItem(
      "estimatedOrderTime",
      "30–45 mins"
    );

    localStorage.setItem(
      "deliveryCharges",
      "150"
    );

    window.dispatchEvent(
      new Event("locationChanged")
    );

    window.dispatchEvent(
      new Event("locationUpdated")
    );

    setShowCloseButton(true);

    setTimeout(() => {
      setIsOpen(false);
      setSaving(false);
      setShowCloseButton(false);
    }, 700);
  }

  /* =====================================================
     CLOSE POPUP
  ===================================================== */

  function closePopup() {
    if (!showCloseButton) {
      return;
    }

    if (
      saving ||
      detectingLocation
    ) {
      return;
    }

    setIsOpen(false);
    setShowCloseButton(false);
  }

  /* =====================================================
     CLOSED
  ===================================================== */

  if (!isOpen) {
    return null;
  }

  /* =====================================================
     LAHORE AREAS
  ===================================================== */

  const selectedAreas =
    locations.Lahore;

  /* =====================================================
     CAN SELECT
  ===================================================== */

  const canSelect =
    areaSubRegion !== "";

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        min-h-screen
        items-center
        justify-center
        bg-black/70
        px-4
        py-6
        backdrop-blur-[5px]
      "
    >
      {/* ================================================= */}
      {/* POPUP */}
      {/* ================================================= */}

      <div
        className="
          relative
          w-full
          max-w-[620px]
          rounded-[20px]
          bg-white
          px-8
          py-10
          shadow-[0_30px_110px_rgba(0,0,0,0.58)]
          sm:px-12
          sm:py-11
        "
      >
        {/* ================================================= */}
        {/* CROSS */}
        {/* ================================================= */}

        {showCloseButton && (
          <button
            type="button"
            onClick={closePopup}
            aria-label="Close location popup"
            className="
              absolute
              right-4
              top-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-[#e5e7eb]
              bg-white
              text-[#6b7280]
              shadow-sm
              transition
              hover:border-[#cf171c]
              hover:bg-[#cf171c]
              hover:text-white
            "
          >
            <X size={20} />
          </button>
        )}

        {/* ================================================= */}
        {/* LOGO */}
        {/* ================================================= */}

      <div className="mt-1 flex w-full justify-center">
  <div
    className="
      relative
      h-[105px]
      w-[105px]
      overflow-hidden
      rounded-2xl
      border
      border-[#c9a35b]/50
      bg-white
      shadow-[0_10px_30px_rgba(0,0,0,0.18)]
      sm:h-[120px]
      sm:w-[120px]
    "
  >
    <img
      src="/images/logo.png"
      alt="Logo"
      className="
        h-full
        w-full
        object-cover
      "
    />
  </div>
</div>

        {/* ================================================= */}
        {/* ORDER TYPE HEADING */}
        {/* ================================================= */}

        <div className="mt-6 text-center">
          <h2
            className="
              text-[16px]
              font-bold
              text-[#3d3d3d]
            "
          >
            Select your order type
          </h2>
        </div>

        {/* ================================================= */}
        {/* DELIVERY */}
        {/* ================================================= */}

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            disabled
            className="
              rounded-full
              bg-[#cf171c]
              px-9
              py-3
              text-[15px]
              font-normal
              text-white
              shadow-md
              transition-all
              duration-200
              hover:bg-[#b91318]
            "
          >
            Delivery
          </button>
        </div>

        {/* ================================================= */}
        {/* HEADING */}
        {/* ================================================= */}

        <div className="mt-7 text-center">
          <h2
            className="
              text-[18px]
              font-bold
              text-black
            "
          >
            Please select your location
          </h2>
        </div>

        {/* ================================================= */}
        {/* CURRENT LOCATION */}
        {/* ================================================= */}

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            disabled={
              saving ||
              detectingLocation
            }
            onClick={
              handleCurrentLocation
            }
            className="
              inline-flex
              h-[42px]
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-[#e5e7eb]
              bg-[#f8f9fa]
              px-5
              whitespace-nowrap
              text-[14px]
              font-normal
              text-[#374151]
              transition-all
              duration-200
              hover:border-[#cf171c]
              hover:bg-[#fff5f5]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <LocateFixed
              size={18}
              strokeWidth={2}
            />

            <span>
              {detectingLocation
                ? "Detecting location..."
                : "Use your current location"}
            </span>
          </button>
        </div>

        {/* ================================================= */}
        {/* CITY / REGION */}
        {/* ================================================= */}

        <div className="mt-7">
          <label
            className="
              mb-2.5
              block
              text-[15px]
              font-black
              text-[#3d3d3d]
            "
          >
            Select City / Region
          </label>

          <div
            className="
              flex
              h-[55px]
              w-full
              items-center
              rounded-[12px]
              border-2
              border-[#cf171c]
              bg-white
              px-5
              text-[16px]
              font-normal
              text-[#292929]
            "
          >
            Lahore
          </div>
        </div>

        {/* ================================================= */}
        {/* AREA / SUB REGION */}
        {/* ================================================= */}

        <div className="mt-5">
          <label
            className="
              mb-2.5
              block
              text-[15px]
              font-black
              text-[#3d3d3d]
            "
          >
            Select Area / Sub Region
          </label>

          <div className="relative">
            <select
              value={areaSubRegion}
              disabled={
                saving ||
                detectingLocation
              }
              onChange={(event) =>
                setAreaSubRegion(
                  event.target.value
                )
              }
              className={`
                h-[55px]
                w-full
                appearance-none
                rounded-[12px]
                border
                bg-white
                px-5
                pr-12
                text-[16px]
                font-normal
                outline-none
                transition-all
                duration-200

                ${
                  areaSubRegion
                    ? "border-2 border-[#cf171c] text-[16px] text-[#292929] focus:border-[#cf171c] focus:ring-0"
                    : "border border-[#cfcfcf] text-[16px] text-[#9ca3af] focus:border-[#cfcfcf] focus:ring-0"
                }
              `}
            >
              <option
                value=""
                disabled
                className="
                  text-[16px]
                  font-normal
                  text-[#c4c4c4]
                "
              >
                Area / Sub Region
              </option>

              {selectedAreas.map(
                (area) => (
                  <option
                    key={area}
                    value={area}
                    className="
                      text-[16px]
                      font-normal
                      text-[#374151]
                    "
                  >
                    {area}
                  </option>
                )
              )}
            </select>

            <div
              className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                -translate-y-1/2
              "
            >
              <ChevronDown
                size={21}
                strokeWidth={2}
                className="text-[#374151]"
              />
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* SELECT BUTTON */}
        {/* ================================================= */}

        <button
          type="button"
          disabled={
            !canSelect ||
            saving ||
            detectingLocation
          }
          onClick={selectLocation}
          className={`
            mt-7
            h-[56px]
            w-full
            rounded-[12px]
            text-[19px]
            font-black
            transition-all
            duration-300

            ${
              saving
                ? "cursor-default bg-yellow-400 text-black shadow-[0_8px_25px_rgba(250,204,21,0.4)]"
                : canSelect
                ? "bg-[#cf171c] text-white shadow-md hover:bg-[#b91318] hover:shadow-lg"
                : "cursor-not-allowed bg-[#c9c9c9] text-[#999]"
            }
          `}
        >
          {saving
            ? "Selected"
            : "Select"}
        </button>
      </div>
    </div>
  );
}