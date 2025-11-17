// src/navigation/RootNavigation.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/data';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// ---- Overload chuẩn giống React Navigation ----
type RootParamList = RootStackParamList;

export function navigate<RouteName extends keyof RootParamList>(
  screen: RouteName
): void;

export function navigate<RouteName extends keyof RootParamList>(
  screen: RouteName,
  params: RootParamList[RouteName]
): void;

export function navigate(screen: any, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(screen, params);
  }
}
