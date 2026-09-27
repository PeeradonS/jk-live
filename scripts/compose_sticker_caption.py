#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import argparse, hashlib, json, os, sys

FONT_CANDIDATES=[
    os.environ.get('JK_STICKER_THAI_FONT',''),
    '/usr/share/fonts/truetype/noto/NotoSansThai-SemiBold.ttf',
    '/usr/share/fonts/truetype/noto/NotoSansThai-Medium.ttf',
    '/usr/share/fonts/opentype/tlwg/Loma-Bold.otf',
]

def font_path():
    for raw in FONT_CANDIDATES:
        if raw and Path(raw).exists():
            return raw
    raise SystemExit('No Thai-capable font found. Set JK_STICKER_THAI_FONT.')

def sha256(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''): h.update(chunk)
    return h.hexdigest()

def fit_font(draw,text,path,max_width):
    for size in range(44,25,-1):
        font=ImageFont.truetype(path,size)
        box=draw.textbbox((0,0),text,font=font,stroke_width=0)
        if box[2]-box[0] <= max_width:
            return font
    return ImageFont.truetype(path,26)

def fit_art(im):
    rgba=im.convert('RGBA')
    bbox=rgba.getchannel('A').getbbox()
    if not bbox: raise ValueError('source art is fully transparent')
    art=rgba.crop(bbox)
    art.thumbnail((420,344),Image.Resampling.LANCZOS)
    return art

def compose(src,caption,font_file):
    canvas=Image.new('RGBA',(512,512),(0,0,0,0))
    art=fit_art(src)
    x=(512-art.width)//2
    y=max(10,(352-art.height)//2)
    canvas.alpha_composite(art,(x,y))

    draw=ImageDraw.Draw(canvas)
    font=fit_font(draw,caption,font_file,380)
    box=draw.textbbox((0,0),caption,font=font)
    tw,th=box[2]-box[0],box[3]-box[1]
    pill_w=min(440,max(150,tw+54))
    pill_h=max(72,th+32)
    px=(512-pill_w)//2
    py=404-pill_h//2

    shadow=Image.new('RGBA',(512,512),(0,0,0,0))
    sd=ImageDraw.Draw(shadow)
    sd.rounded_rectangle((px,py+5,px+pill_w,py+pill_h+5),radius=pill_h//2,fill=(47,28,35,38))
    shadow=shadow.filter(ImageFilter.GaussianBlur(7))
    canvas.alpha_composite(shadow)

    draw=ImageDraw.Draw(canvas)
    draw.rounded_rectangle(
        (px,py,px+pill_w,py+pill_h),
        radius=pill_h//2,
        fill=(255,255,255,246),
        outline=(231,207,214,255),
        width=4
    )
    tx=256
    ty=py+(pill_h-th)//2-box[1]
    draw.text((tx,ty),caption,font=font,anchor='ma',fill=(57,42,48,255))
    return canvas

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--brief',default='resources/stickers/wave1-art-brief.json')
    ap.add_argument('--pack',required=True)
    ap.add_argument('--source-dir',required=True)
    ap.add_argument('--output-dir',required=True)
    args=ap.parse_args()

    root=Path.cwd()
    brief=json.loads((root/args.brief).read_text(encoding='utf-8'))
    pack=next((p for p in brief['packs'] if p['pack_id']==args.pack),None)
    if not pack: raise SystemExit(f'Pack not found in brief: {args.pack}')
    captions=pack['captions']
    if len(captions)!=24: raise SystemExit('Pack must contain exactly 24 captions')

    src_dir=root/args.source_dir
    out_dir=root/args.output_dir
    out_dir.mkdir(parents=True,exist_ok=True)
    ff=font_path()
    manifest=[]

    for i,caption in enumerate(captions,1):
        name=f'{i:02d}.png'
        src=src_dir/name
        if not src.exists(): raise SystemExit(f'Missing source art: {src}')
        with Image.open(src) as im:
            final=compose(im,caption,ff)
        out=out_dir/name
        final.save(out,'PNG',optimize=True)
        bbox=final.getchannel('A').getbbox()
        safe=bool(bbox and bbox[0]>=24 and bbox[1]>=8 and bbox[2]<=488 and bbox[3]<=488)
        if not safe: raise SystemExit(f'{name}: output violates safe area: {bbox}')
        manifest.append({
            'index':i,'file':name,'caption_th':caption,
            'width':512,'height':512,'rgba':True,'safe_area_pass':safe,'sha256':sha256(out)
        })

    result={
        'pack_id':pack['pack_id'],
        'title':pack['title'],
        'asset_standard':'JK-512-RGBA-v1',
        'sticker_count':24,
        'caption_source':args.brief,
        'font_runtime_reference':Path(ff).name,
        'items':manifest
    }
    (out_dir/'manifest.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f"JK STICKER COMPOSE PASS · {pack['pack_id']} · 24 PNG")

if __name__=='__main__':
    main()
