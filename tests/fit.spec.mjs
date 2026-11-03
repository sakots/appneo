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

for (const zoom of [1, 1.25, 1.5]) {
  test(`FIT layout settles with a zoomed canvas and classic scrollbars at ${zoom}x page scale`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/appneoLocalTest/");
    await page.evaluate((scale) => {
      document.documentElement.style.zoom = String(scale);
    }, zoom);
    await page.locator("#start-appneo").click();
    await expect(page.locator("#appneo-status")).toBeEmpty({ timeout: 60000 });
    for (let i = 0; i < 4; i++) {
      await page.locator("#neo-zoomPlus").click();
    }

    const expectStableLayout = async (fits) => {
      const frames = await page.evaluate(async () => {
        const stage = document.getElementById("appneo-applet");
        const container = document.getElementById("neo-container");
        const frames = [];
        for (let i = 0; i < 30; i++) {
          await new Promise(requestAnimationFrame);
          frames.push({
            width: stage.clientWidth,
            height: stage.clientHeight,
            scrollWidth: stage.scrollWidth,
            scrollHeight: stage.scrollHeight,
            appletWidth: container.style.width,
            appletHeight: container.style.height,
          });
          const stageBounds = stage.getBoundingClientRect();
          const toolsBounds = document
            .getElementById("neo-toolsWrapper")
            .getBoundingClientRect();
          frames.at(-1).toolsWithinStage =
            toolsBounds.left >= stageBounds.left &&
            toolsBounds.right <= stageBounds.right &&
            toolsBounds.top >= stageBounds.top &&
            toolsBounds.bottom <= stageBounds.bottom;
        }
        return frames.slice(10);
      });
      expect(new Set(frames.map((frame) => JSON.stringify(frame))).size).toBe(
        1,
      );
      const last = frames.at(-1);
      if (fits) {
        expect(last.scrollWidth).toBe(last.width);
        expect(last.scrollHeight).toBe(last.height);
        expect(last.toolsWithinStage).toBe(true);
      } else {
        expect(
          last.scrollWidth > last.width || last.scrollHeight > last.height,
        ).toBe(true);
      }
    };

    await page.locator("#appneo-fit-button").click();
    await expectStableLayout(true);
    await page.locator('input[value="Left"]').click();
    await expectStableLayout(true);
    await page.locator('input[value="Right"]').click();
    await expectStableLayout(true);
    await page.setViewportSize({ width: 480, height: 400 });
    await expectStableLayout(false);
    await page.setViewportSize({ width: 1280, height: 900 });
    await expectStableLayout(true);
    await page.keyboard.press("Escape");
    await page.locator("#appneo-fit-button").click();
    await expectStableLayout(true);
  });
}
