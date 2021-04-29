export interface Sector {
  id: number;
  title: string;
  checked: boolean;
  level: number;
  childList: Sector[];
}
