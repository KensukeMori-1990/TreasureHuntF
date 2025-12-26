/**
 * GameRule Interface
 * すべてのゲームルールが実装すべきインターフェース
 */

/**
 * ゲームルールインターフェース
 */
export interface GameRule<TState = any, TAction = any> {
  /** ルールの一意識別子 */
  id: string;

  /** 表示名 */
  name: string;

  /** 初期化処理（コア側でロード時に1回呼ばれる） */
  init(): void;

  /** 管理画面のUIを返す */
  renderAdmin(props: RenderProps<TState>): JSX.Element;

  /** ナビゲーション画面のUIを返す */
  renderView(props: RenderProps<TState>): JSX.Element;

  /** 操作ボタン画面のUIを返す */
  renderAction(props: RenderProps<TState>): JSX.Element;

  /** アクション実行時のコールバック（任意のクライアント側処理） */
  onAction(action: TAction, state: TState): Promise<void>;
}

/**
 * ルールのrender関数に渡されるprops
 */
export interface RenderProps<TState> {
  /** 現在の状態（Firestoreから取得） */
  state: TState;

  /** アクションを実行（コア側のAPI経由でFunctionsを呼ぶ） */
  executeAction: (action: any) => Promise<void>;

  /** 状態を再読み込み */
  refreshState: () => Promise<void>;

  /** 管理者権限があるか */
  isAdmin: boolean;

  /** URLから取得したQRコードタグ (ActionPanelで使用) */
  qrTag?: string;

  /** ナビゲーション関数 (SuccessPanelで使用) */
  navigate?: (path: string) => void;
}
