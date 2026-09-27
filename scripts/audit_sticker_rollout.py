#!/usr/bin/env python3
from pathlib import Path
import json, sys

ROOT=Path(__file__).resolve().parents[1]
manifest_path=ROOT/'resources'/'stickers'/'rollout-v1.json'
data=json.loads(manifest_path.read_text(encoding='utf-8'))
packs=data.get('packs') or []
errors=[]

if len(packs)!=50:
    errors.append(f'expected 50 packs, found {len(packs)}')
ids=[p.get('pack_id') for p in packs]
if len(set(ids))!=len(ids):
    errors.append('duplicate pack_id in rollout manifest')
if sum(int(p.get('target_count') or 0) for p in packs)!=1200:
    errors.append('target sticker count is not 1200')

for p in packs:
    pid=p.get('pack_id')
    count=int(p.get('target_count') or 0)
    if count!=24:
        errors.append(f'{pid}: target_count must be 24')
    status=p.get('art_status')
    ready=bool(p.get('sale_ready'))
    if status=='production':
        if not ready:
            errors.append(f'{pid}: production but sale_ready=false')
        raw=p.get('standardized_path')
        if not raw:
            errors.append(f'{pid}: production without standardized_path')
            continue
        folder=ROOT/raw
        files=sorted(folder.glob('*.png')) if folder.exists() else []
        if len(files)!=24:
            errors.append(f'{pid}: expected 24 PNGs in {raw}, found {len(files)}')
    else:
        if ready:
            errors.append(f'{pid}: pending art cannot be sale_ready')

wave1=[p for p in packs if int(p.get('rollout_wave') or 0)==1]
if len(wave1)!=8:
    errors.append(f'wave 1 must contain 8 flagship packs, found {len(wave1)}')

if errors:
    print('JK STICKER ROLLOUT AUDIT FAIL')
    for e in errors: print('-',e)
    sys.exit(1)

production=sum(1 for p in packs if p.get('art_status')=='production')
print(f'JK STICKER ROLLOUT AUDIT PASS · packs=50 stickers=1200 production={production} pending={50-production} wave1=8')
