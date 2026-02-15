// ── Player Context ──
// Manages Supabase Auth state: login, register, logout, player profile.
// Wraps the entire app — provides the current player to all screens.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// ─── Types ───

export interface PlayerProfile {
  id: string;
  username: string;
  avatarUrl: string | null;
  totalRuns: number;
  totalCharacters: number;
  createdAt: string;
}

interface PlayerContextValue {
  /** Current Supabase user (null if not logged in) */
  user: User | null;
  /** Current session */
  session: Session | null;
  /** Player profile from DB */
  profile: PlayerProfile | null;
  /** Loading auth state */
  loading: boolean;
  /** Auth error message */
  error: string | null;
  /** Register with email, password, and username */
  register: (email: string, password: string, username: string) => Promise<boolean>;
  /** Login with email & password */
  login: (email: string, password: string) => Promise<boolean>;
  /** Logout */
  logout: () => Promise<void>;
  /** Update profile */
  updateProfile: (data: Partial<Pick<PlayerProfile, 'username' | 'avatarUrl'>>) => Promise<boolean>;
  /** Clear error */
  clearError: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

// ─── Provider ───

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch profile from DB ──
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error: fetchErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchErr) {
      console.warn('[Player] Failed to fetch profile:', fetchErr.message);
      return null;
    }

    const p: PlayerProfile = {
      id: data.id,
      username: data.username,
      avatarUrl: data.avatar_url,
      totalRuns: data.total_runs,
      totalCharacters: data.total_characters,
      createdAt: data.created_at,
    };
    setProfile(p);
    return p;
  }, []);

  // ── Initialize auth state ──
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          fetchProfile(s.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── Register ──
  const register = useCallback(async (email: string, password: string, username: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      const { error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (signUpErr) {
        setError(signUpErr.message);
        setLoading(false);
        return false;
      }

      setLoading(false);
      return true;
    } catch (e) {
      setError('Registrierung fehlgeschlagen');
      setLoading(false);
      return false;
    }
  }, []);

  // ── Login ──
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInErr) {
        setError(signInErr.message);
        setLoading(false);
        return false;
      }

      setLoading(false);
      return true;
    } catch (e) {
      setError('Anmeldung fehlgeschlagen');
      setLoading(false);
      return false;
    }
  }, []);

  // ── Logout ──
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  // ── Update Profile ──
  const updateProfile = useCallback(async (data: Partial<Pick<PlayerProfile, 'username' | 'avatarUrl'>>): Promise<boolean> => {
    if (!user) return false;

    const updateData: Record<string, unknown> = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

    const { error: updateErr } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (updateErr) {
      setError(updateErr.message);
      return false;
    }

    await fetchProfile(user.id);
    return true;
  }, [user, fetchProfile]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <PlayerContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// ─── Hook ───

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
