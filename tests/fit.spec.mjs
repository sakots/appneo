import { expect, test } from "@playwright/test";

test("FIT keeps the drawing viewport consistent without changing the artwork or zoom", async ({
  page,
}) => {
  await page.goto("/appneoLocalTest/");
  await page.locator("#start-appneo").click();
  await expect(page.locator("#appneo-status")).toBeEmpty({ timeout: 60000 });
  await page.locator("#neo-zoomPlus").click();
  const original = await page.evaluate(() => {
    const painter = window.Neo.painter;
    painter.canvasCtx[0].fillStyle = "#ff0000";
    painter.canvasCtx[0].fillRect(100, 100, 30, 30);
    painter.updateDestCanvas(
      0,
      0,
      painter.canvasWidth,
      painter.canvasHeight,
      false,
    );
    return { image: painter.getImage().toDataURL(), zoom: painter.zoom };
  });

  const expectConsistentViewport = async () => {
    await expect
      .poll(() =>
        page.evaluate(() => {
          const painter = window.Neo.painter;
          const box = window.Neo.canvas;
          return {
            width:
              painter.destCanvas.width === painter.destWidth &&
              parseFloat(box.style.width) === painter.destWidth,
            height:
              painter.destCanvas.height === painter.destHeight &&
              parseFloat(box.style.height) === painter.destHeight,
          };
        }),
      )
      .toEqual({ width: true, height: true });
    expect(
      await page.evaluate(() => {
        const painter = window.Neo.painter;
        return { image: painter.getImage().toDataURL(), zoom: painter.zoom };
      }),
    ).toEqual(original);
    expect(
      await page.evaluate(() => {
        const painter = window.Neo.painter;
        const x = Math.floor(
          painter.destWidth / 2 + (115 - painter.zoomX) * painter.zoom,
        );
        const y = Math.floor(
          painter.destHeight / 2 + (115 - painter.zoomY) * painter.zoom,
        );
        return [...painter.destCanvasCtx.getImageData(x, y, 1, 1).data];
      }),
    ).toEqual([255, 0, 0, 255]);
  };

  await page.locator("#appneo-fit-button").click();
  await expectConsistentViewport();
  await page.setViewportSize({ width: 640, height: 480 });
  await expectConsistentViewport();
  await page.keyboard.press("Escape");
  await expect(page.locator("#appneo-fit-button")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await expectConsistentViewport();
});
