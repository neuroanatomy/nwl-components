# Icons

One SVG per meaning, shared by nwl-components, BrainBox and microdraw (UI kit step 11c, 2.3.0).
The build copies them to `dist/icons/` (`nwl-components/icons/<name>.svg` through `exports`;
`nwl-components/dist/icons/<name>.svg` for webpack 4). See the package README, "Icons".

The drawings are the apps' files as they were, byte for byte: no redraw, no `viewBox` or
colour change. They are drawn in fixed white (some with black cut-outs or grey accents), for
dark backgrounds; none follows the text colour.

## Map

One row per icon. **Source** is the file the icon was copied from (the repos at nwl-components
`ccecc6b`, BrainBox `ca8ef20`, microdraw `43e09e5`). **Replaces** lists the copies in the other
repos that the apps point at this file instead; each one is byte-identical to the source, or
re-encoded with the same drawing (rendered at 48 px with `rsvg-convert`, compared with
`magick compare`: 0 differing pixels). The one exception: `download` and `upload` replace
nwl's own, different drawings (the settings page's Files list changes).

| Name | Meaning | Source | Replaces |
|---|---|---|---|
| `adjust` | brightness/contrast (adjust) | nwl-components `src/assets/adjust.svg` | BrainBox `view/atlasmaker/src/html/img/adjust.svg`; BrainBox `view/atlasmaker/src/tools/adjust/adjust.svg` |
| `alpha` | opacity | nwl-components `src/assets/alpha.svg` | BrainBox `view/atlasmaker/src/tools/adjust/alpha.svg` |
| `bars` | menu | nwl-components `src/assets/bars.svg` | BrainBox `view/atlasmaker/src/html/img/bars.svg`; microdraw `app/public/img/bars.svg` |
| `bug` | report a bug | nwl-components `src/assets/bug.svg` | BrainBox `public/img/bug.svg`; microdraw `app/public/img/bug.svg` |
| `caret-square-o-left` | dock left | nwl-components `src/assets/caret-square-o-left.svg` | BrainBox `view/atlasmaker/src/html/img/caret-square-o-left.svg`; microdraw `app/public/img/caret-square-o-left.svg` |
| `caret-square-o-right` | dock right | nwl-components `src/assets/caret-square-o-right.svg` | BrainBox `view/atlasmaker/src/html/img/caret-square-o-right.svg`; microdraw `app/public/img/caret-square-o-right.svg` |
| `chat` | chat | nwl-components `src/assets/chat.svg` | BrainBox `view/atlasmaker/src/html/img/chat.svg`; microdraw `app/public/img/chat.svg` |
| `doc` | documentation | nwl-components `src/assets/doc.svg` | BrainBox `public/img/doc.svg`; microdraw `app/public/img/doc.svg` |
| `download` | download | BrainBox `view/atlasmaker/src/html/img/download.svg` | nwl-components `src/assets/download.svg` (different drawing) |
| `eye` | access: view | nwl-components `src/assets/eye.svg` | BrainBox `public/img/eye.svg`; microdraw `app/public/img/eye.svg` |
| `eye-circle` | access: view (granted) | nwl-components `src/assets/eye-circle.svg` | BrainBox `public/img/eye-circle.svg`; microdraw `app/public/img/eye-circle.svg` |
| `github` | GitHub | nwl-components `src/assets/github.svg` | BrainBox `public/img/github.svg`; microdraw `app/public/img/github.svg` |
| `minus-small` | access: remove | nwl-components `src/assets/minus-small.svg` | BrainBox `public/img/minus-small.svg`; microdraw `app/public/img/minus-small.svg` |
| `minus-small-circle` | access: remove (granted) | nwl-components `src/assets/minus-small-circle.svg` | BrainBox `public/img/minus-small-circle.svg`; microdraw `app/public/img/minus-small-circle.svg` |
| `pencil` | access: edit | nwl-components `src/assets/pencil.svg` | BrainBox `public/img/pencil.svg`; microdraw `app/public/img/pencil.svg` |
| `pencil-circle` | access: edit (granted) | nwl-components `src/assets/pencil-circle.svg` | BrainBox `public/img/pencil-circle.svg`; microdraw `app/public/img/pencil-circle.svg` |
| `plus` | add project | nwl-components `src/assets/plus.svg` | BrainBox `public/img/plus.svg`; microdraw `app/public/img/plus.svg` |
| `plus-small` | access: add | nwl-components `src/assets/plus-small.svg` | BrainBox `public/img/plus-small.svg`; microdraw `app/public/img/plus-small.svg` |
| `plus-small-circle` | access: add (granted) | nwl-components `src/assets/plus-small-circle.svg` | BrainBox `public/img/plus-small-circle.svg`; microdraw `app/public/img/plus-small-circle.svg` |
| `scroll` | script console | nwl-components `src/assets/scroll.svg` | BrainBox `view/atlasmaker/src/html/img/scroll.svg`; microdraw `app/public/img/scroll.svg` |
| `search` | search | nwl-components `src/assets/search.svg` | BrainBox `public/img/search.svg` |
| `settings` | settings | nwl-components `src/assets/settings.svg` | BrainBox `public/img/settings.svg`; microdraw `app/public/img/settings.svg` |
| `sun-o` | brightness | nwl-components `src/assets/sun-o.svg` | BrainBox `view/atlasmaker/src/tools/adjust/sun-o.svg` |
| `times-circle` | close | nwl-components `src/assets/times-circle.svg` | BrainBox `view/atlasmaker/src/html/img/times-circle.svg`; microdraw `app/public/img/times-circle.svg` |
| `upload` | upload | BrainBox `view/atlasmaker/src/html/img/upload.svg` | nwl-components `src/assets/upload.svg` (different drawing) |
| `fullscreen` | fullscreen | BrainBox `view/atlasmaker/src/html/img/fullscreen.svg` | microdraw `app/public/img/fullscreen.svg` |
| `save` | save | microdraw `app/public/img/save.svg` | BrainBox `view/atlasmaker/src/html/img/floppy.svg` (other name) |
| `undo` | undo | microdraw `app/public/img/undo.svg` | BrainBox `view/atlasmaker/src/html/img/undo.svg` |
| `3drender` | 3D render | BrainBox `view/atlasmaker/src/html/img/3drender.svg` | - |
| `erase` | eraser | BrainBox `view/atlasmaker/src/html/img/erase.svg` | - |
| `eyedropper` | eyedropper | BrainBox `view/atlasmaker/src/html/img/eyedropper.svg` | - |
| `fill` | fill | BrainBox `view/atlasmaker/src/html/img/fill.svg` | - |
| `landmark` | landmark | BrainBox `view/atlasmaker/src/html/img/landmark.svg` | - |
| `link` | share link | BrainBox `view/atlasmaker/src/html/img/link.svg` | - |
| `paint` | paint (pencil) | BrainBox `view/atlasmaker/src/html/img/paint.svg` | - |
| `preciseCursor` | precise cursor | BrainBox `view/atlasmaker/src/html/img/preciseCursor.svg` | - |
| `ruler` | measure | BrainBox `view/atlasmaker/src/html/img/ruler.svg` | - |
| `show` | show / collaborator pointer | BrainBox `view/atlasmaker/src/html/img/show.svg` | - |
| `download-square` | download (square, landmarks panel) | BrainBox `public/img/download-square.svg` | - |
| `minus-square` | remove (square, landmarks panel) | BrainBox `public/img/minus-square.svg` | - |
| `addPoint` | add point | microdraw `app/public/img/addPoint.svg` | - |
| `addRegion` | union | microdraw `app/public/img/addRegion.svg` | - |
| `back` | send to back | microdraw `app/public/img/back.svg` | - |
| `backward` | send backward | microdraw `app/public/img/backward.svg` | - |
| `copy` | copy | microdraw `app/public/img/copy.svg` | - |
| `delete` | delete | microdraw `app/public/img/delete.svg` | - |
| `deletePoint` | delete point | microdraw `app/public/img/deletePoint.svg` | - |
| `draw` | draw curve | microdraw `app/public/img/draw.svg` | - |
| `drawLine` | draw line | microdraw `app/public/img/drawLine.svg` | - |
| `drawPolygon` | draw polygon | microdraw `app/public/img/drawPolygon.svg` | - |
| `eyeClosed` | region hidden | microdraw `app/public/img/eyeClosed.svg` | - |
| `eyeOpened` | region visible | microdraw `app/public/img/eyeOpened.svg` | - |
| `findContours` | find contours | microdraw `app/public/img/findContours.svg` | - |
| `flipRegion` | flip | microdraw `app/public/img/flipRegion.svg` | - |
| `foreward` | bring forward | microdraw `app/public/img/foreward.svg` | - |
| `front` | bring to front | microdraw `app/public/img/front.svg` | - |
| `home` | home (fit) | microdraw `app/public/img/home.svg` | - |
| `layers` | layers | microdraw `app/public/img/layers.svg` | - |
| `move` | move | microdraw `app/public/img/move.svg` | - |
| `navigate` | navigate | microdraw `app/public/img/navigate.svg` | - |
| `paste` | paste | microdraw `app/public/img/paste.svg` | - |
| `redo` | redo | microdraw `app/public/img/redo.svg` | - |
| `rotate` | rotate | microdraw `app/public/img/rotate.svg` | - |
| `screenshot` | screenshot | microdraw `app/public/img/screenshot.svg` | - |
| `select` | select | microdraw `app/public/img/select.svg` | - |
| `simplify` | simplify | microdraw `app/public/img/simplify.svg` | - |
| `splitRegion` | split | microdraw `app/public/img/splitRegion.svg` | - |
| `subtractRegion` | difference | microdraw `app/public/img/subtractRegion.svg` | - |
| `textAnnotation` | text annotation | microdraw `app/public/img/textAnnotation.svg` | - |
| `toBezier` | to Bézier | microdraw `app/public/img/toBezier.svg` | - |
| `toPolygon` | to polygon | microdraw `app/public/img/toPolygon.svg` | - |
| `zoomIn` | zoom in | microdraw `app/public/img/zoomIn.svg` | - |
| `zoomOut` | zoom out | microdraw `app/public/img/zoomOut.svg` | - |

How each source was picked: nwl's copy where there was one; otherwise the copy with the most
live references (`fullscreen`: BrainBox 3, microdraw 1). `download`/`upload` are BrainBox's
drawing by decision. Ties: `undo` (1 each) is microdraw's, from the same set as `redo`; `save`
and BrainBox's `floppy` are byte-identical, and `save` is the clearer name. Names are nwl's, or
the apps' (BrainBox and microdraw never used two names for one drawing, except `floppy`).

Adding an icon: add the file here and a row to this table. The `Icons/All` story checks that
the number of files equals the number of rows.
