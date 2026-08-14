'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import CommandCenterActionRouter from './CommandCenterActionRouter';

// Command Center operating shell. Action buttons are routed by CommandCenterActionRouter
// so the existing visual shell can keep its controlled button presentation while every
// consequence-bearing CTA resolves to an actual World 05 operating route.

"+"