#!/usr/bin/env python3
from pathlib import Path
import json, sys

ROOT=Path(__file__).resolve().parents[1]
brief=json.loads((ROOT/'resources'/'stickers'/'wave1-art-brief.json').read_text(encoding='utf-8'))
rollout=json.loads((ROOT/'resources'/'stickers'/'rollout-v1.json').read_text(encoding='utf-8'))
packs=brief.get('packs') or []
errors=[]

if len(packs)!=8:
    errors.append(f'wave1 brief must contain 8 packs, found {len(packs)}')

ids=[p.get('pack_id') for p in packs]
if len(set(ids))!=len(ids):
    errors.append('duplicate pack_id in wave1 brief')

rollout_wave1={p['pack_id'] for p in rollout.get('packs',[]) if int(p.get('rollout_wave') or 0)==1}
if set(ids)!=rollout_wave1:
    errors.append(f'wave1 brief IDs do not match rollout wave1: brief={sorted(ids)} rollout={sorted(rollout_wave1)}')

for p in packs:
    captions=p.get('captions') or []
    if len(captions)!=24:
        errors.append(f"{p.get('pack_id')}: expected 24 captions, found {len(captions)}")
    if any(not str(x).strip() for x in captions):
        errors.append(f"{p.get('pack_id')}: blank caption")
    if len(set(map(str.strip,captions)))!=24:
        errors.append(f"{p.get('pack_id')}: duplicate caption within pack")
    if not str(p.get('character') or '').strip():
        errors.append(f"{p.get('pack_id')}: missing character art direction")

if errors:
    print('JK STICKER WAVE 1 BRIEF AUDIT FAIL')
    for e in errors: print('-',e)
    sys.exit(1)

print('JK STICKER WAVE 1 BRIEF AUDIT PASS · 8 packs · 192 captions')
