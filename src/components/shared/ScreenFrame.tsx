import { Icon, type IconName } from "@/components/shared/Icon";

/**
 * A screenshot presented as a browser window.
 *
 * The work in this portfolio is screens, and a bare screenshot cropped to a
 * card reads as a stock photo. The chrome says "this is a live product" in a
 * way a caption cannot, and it gives the crop a deliberate edge instead of an
 * accidental one.
 *
 * `object-top` is the load-bearing part: screenshots of web pages carry their
 * identity in the first few hundred pixels — logo, navigation, headline. A
 * centred crop of a long page lands on whatever happened to be in the middle,
 * which is how the previous cards ended up showing blank panels and half a
 * table.
 *
 * No address bar. Showing a URL we do not have would mean inventing one, and
 * three dots carry the same meaning without the claim.
 */
export function ScreenFrame({
  src,
  alt,
  fallbackIcon = "monitor",
  aspect = "aspect-[16/10]",
  fit = "cover",
  zoomOnHover = false,
}: {
  src: string | null;
  alt: string;
  fallbackIcon?: IconName;
  aspect?: string;
  /** `natural` lets the screenshot determine the frame height. */
  fit?: "cover" | "contain" | "natural";
  zoomOnHover?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line-soft bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center gap-[5px] border-b border-line-soft bg-offwhite px-3 py-2.5">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-input-line" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-input-line" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-input-line" />
      </div>

      <div className={`${fit === "natural" ? "" : aspect} overflow-hidden bg-sand`}>
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className={`${
              fit === "natural"
                ? "block h-auto w-full"
                : `h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} object-top`
            } ${
              zoomOnHover
                ? "transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                : ""
            }`}
          />
        ) : (
          <div className="grid h-full place-items-center text-input-line">
            <Icon name={fallbackIcon} size={34} />
          </div>
        )}
      </div>
    </div>
  );
}
