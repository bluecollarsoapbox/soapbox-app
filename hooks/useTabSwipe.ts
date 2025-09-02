// hooks/useTabSwipe.ts
import { useMemo, useRef } from 'react';
import { PanResponder } from 'react-native';
import { useRouter } from 'expo-router';

type TabName = 'index' | 'confessions' | 'hotline' | 'explore' | 'links' | 'pizza';

// 👉 put your tab order here (left→right in the tab bar)
const ORDER: TabName[] = ['index', 'confessions', 'hotline', 'explore', 'links', 'pizza'];

export function useTabSwipe(current: TabName) {
  const router = useRouter();
  const firedRef = useRef(false);

  const goTo = (name: TabName) => router.navigate(`/(tabs)/${name}`);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_e, g) =>
          Math.abs(g.dx) > 20 && Math.abs(g.dy) < 20, // horizontal only
        onPanResponderGrant: () => {
          firedRef.current = false;
        },
        onPanResponderMove: (_e, g) => {
          if (firedRef.current) return;
          if (g.dx < -50) {
            firedRef.current = true;
            const i = ORDER.indexOf(current);
            const next = ORDER[(i + 1 + ORDER.length) % ORDER.length];
            goTo(next);
          } else if (g.dx > 50) {
            firedRef.current = true;
            const i = ORDER.indexOf(current);
            const prev = ORDER[(i - 1 + ORDER.length) % ORDER.length];
            goTo(prev);
          }
        },
        onPanResponderRelease: () => {
          firedRef.current = false;
        },
        onPanResponderTerminate: () => {
          firedRef.current = false;
        },
      }),
    [current]
  );

  return pan.panHandlers;
}
