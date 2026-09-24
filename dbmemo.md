調査結果を確認した上で、コード側で安全に対応できる2点を実装しました。

実施した対策

① Edge Function とDBのリージョン不一致
app/api/deadlines/route.js [id]/route.js、app/api/types/route.js [id]/route.js、app/api/companies/route.js に export const preferredRegion = "sin1"; を追加。Neonが ap-southeast-1（Singapore）にあるのに対し、Edge Functionの実行リージョンを明示的にそこへ固定し、関数↔DB間の往復レイテンシを削減しました。

② クライアント fetch ウォーターフォールの解消
/・/calendar・/settings を async Server Component化し、getAllDeadlines() / getAllTypes() をサーバー側で直接呼び出して初期データをHTMLに埋め込む方式に変更（app/page.js, app/calendar/page.js, app/settings/page.js）。これまでの「HTML→JS→hydrate→useEffect→fetch→DB」という直列の経路がなくなり、初回表示時点で実データが既にHTMLに含まれます。各クライアントコンポーネント（DeadlineListPage, CalendarPageClient, SettingsPageClient,
Confirmed: revalidateTag correctly invalidates the static page cache too — new data appears immediately after a mutation, with no stale-data risk. This means reads are now served as fully static HTML (zero DB round-trip) until a write happens. Cleaning up the test data:

  Ran 2 shell commands

Cleaned up and verified end-to-end. Let's do one final production b consistent:

  Ran 1 shell command

調査結果を確認した上で、コード側で安全に対応できる2点を実装しました

実施した対策

① Edge Function とDBのリージョン不一致
app/api/deadlines/route.js [id]/route.js、app/api/types/route.js [id]/route.js、app/api/companies/route.js に export const preferredRegion = "sin1"; を追加。Neonが ap-southeast-1（Singapore）にあるのに対し、Edge Functionの実行リージョンを明示的にそこへ固定し、関数↔DB間の往復レイテンシを削減しました。

② クライアント fetch ウォーターフォールの解消
/・/calendar・/settiをサーバー側で直接呼び出して初期データをHTMLに埋め込む方式に変更（a.js, app/settings/page.js）。これまでの「HTML→JS→hydrate→useEffect→fetch→DB」という直列の経路がなくなり、初回表示時点で実データが既にHTMLに含まれます。各クライアントコンポーネント（DeadlineListPage, CalendarPageClient, SettingsPageClient, useDeadlineTypesフック）はこの初期データを受け取って状態をシードし ・種別変更）は従来通りクライアント側で再フェッチします。

副次的な効果の確認：この変更でNext.jsが / /calendar /settings を静的ページとして生成するようになりましたが、revalidateTag() が Data Cache だけでなく静的ページ側も正しく無効化することを実機（next build && next start を実際のNeonに対して）で検証済みです。追加→即リロードでテストし、書き込み直後も正しく最
新データが反映されることを確認し、テストデータは削除済みです。これ 静的HTMLで返り、書き込み直後だけ再生成コストを払う形になります。

実施しなかった対策（判断が必要なため）

- DBリージョンをTokyo等に作り直す — 一番効果が大きいですが、新規Neoを伴うインフラ変更のため未実施
- Neonのautosuspend延長/無効化 — 有料プラン変更が必要
- Cronでの定期ウォームアップ — 実装は簡単ですが、autosuspend（スケールtoゼロ）を意図的に殺すことになりNeonのコンピュート課金が常時発生します。costとのトレードオフなのでご判断次第で対応します

ビルド・実機検証済みです。npm run dev で開発サーバーに戻ります。