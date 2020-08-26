export default {
  queryPolicyList: 'post /smurfs/policy/page/{pageSize}/{pageNum}',
  queryPolicyType: '/smurfs/policy/type/list',
  queryPolicyPublisher: '/smurfs/policy/publisher',
  queryComBase: 'post /shield/app/tag/basic',
  checkBindStatus: '/shield/app/enterprise/user/binding/status',
  queryComExtra: 'post /shield/app/tag/extra',
  saveEnterprise: 'post /shield/app/talent/enterprise/save',
  matchEnterprise: 'post /smurfs/match',
  queryComMatchList: 'post /smurfs/match/result/page/{pageSize}/{pageNum}',
  // 匹配报告
  queryReportHistory: 'post /shield/app/smurf/record/history',
  queryReportOverview: '/smurfs/match/result/overview',
  queryReportChart: 'post /smurfs/match/evaluate/report',

  // 政策详情
  queryPolicyBaseInfo: '/smurfs/policy/statement/{id}',
  queryPolicyContent: '/smurfs/policy/statement/{id}/outline',
  queryPolicyTagInfo: 'post /smurfs/policy/user/info',
};
