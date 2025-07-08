declare module "turndown-plugin-gfm" {
  // gfm은 직접 사용할 수 있는 플러그인입니다
  export const gfm: TurndownService.Plugin

  // 개별 플러그인들도 export됩니다
  export const strikethrough: TurndownService.Plugin
  export const tables: TurndownService.Plugin
  export const taskListItems: TurndownService.Plugin
  export const fencedCodeBlocks: TurndownService.Plugin
}
