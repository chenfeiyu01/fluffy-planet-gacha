"""Run with Blender --background --python scripts/render_previews.py -- <project-root>."""
import bpy,sys
from pathlib import Path
root=Path(sys.argv[sys.argv.index('--')+1]).resolve()
sys.path.insert(0,str(root/'vendor/holo-card-studio/scripts'))
from blender_compat import configure_cycles_device
for name in ['bunny','cat']:
    project=root/'cards'/name
    bpy.ops.wm.open_mainfile(filepath=str(project/'card.blend'))
    s=bpy.context.scene
    configure_cycles_device(s)
    s.render.resolution_percentage=40
    s.cycles.samples=12
    for frame,label in [(24,'front'),(48,'magic')]:
        s.frame_set(frame)
        s.render.filepath=str(project/'renders'/f'{label}.png')
        bpy.ops.render.render(write_still=True)
