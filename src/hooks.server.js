import {sequence} from '@sveltejs/kit/hooks';
import {handleAuth } from '$lib/server/hooks/auth.js';

export const handle = sequence(handleAuth);