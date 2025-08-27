const API_BASE = 'http://localhost:4000/api';

function authHeaders(){
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Mock data
const mockProjects = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    description: 'Complete testing suite for the new e-commerce platform including payment integration and user management.',
    status: 'Active',
    progress: 75,
    teamSize: 8,
    bugs: 12,
    testCases: 156,
    startDate: '2024-01-15T00:00:00.000Z',
    meta: {
      product: 'E-Commerce',
      testType: 'SIT/UAT',
      testMode: 'Manual/Automation',
      tools: ['Selenium', 'Jest', 'Cypress'],
      cycles: { ISB: 2, Unit: 15, Prototype: 8, SIT: 12, UAT: 6 }
    }
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    description: 'Security and performance testing for the mobile banking application.',
    status: 'In Development',
    progress: 45,
    teamSize: 6,
    bugs: 8,
    testCases: 89,
    startDate: '2024-02-01T00:00:00.000Z',
    meta: {
      product: 'Banking',
      testType: 'Security/Performance',
      testMode: 'Manual',
      tools: ['Appium', 'OWASP ZAP'],
      cycles: { ISB: 1, Unit: 8, Prototype: 4, SIT: 6, UAT: 3 }
    }
  },
  {
    id: '3',
    name: 'Customer Portal',
    description: 'User experience and functionality testing for the customer self-service portal.',
    status: 'Completed',
    progress: 100,
    teamSize: 4,
    bugs: 2,
    testCases: 67,
    startDate: '2023-11-20T00:00:00.000Z',
    meta: {
      product: 'Portal',
      testType: 'Functional/UX',
      testMode: 'Manual',
      tools: ['Selenium', 'Lighthouse'],
      cycles: { ISB: 1, Unit: 6, Prototype: 3, SIT: 4, UAT: 2 }
    }
  }
];

const mockTestCases = [
  {
    id: 'TC001',
    workstream: 'Authentication',
    name: 'User Login with Valid Credentials',
    description: 'Verify that users can successfully log in with valid username and password.',
    steps: [
      'Navigate to login page',
      'Enter valid username',
      'Enter valid password',
      'Click login button'
    ],
    expectedResults: 'User should be redirected to dashboard',
    type: 'Functional',
    plannedDate: '2024-03-01',
    actualDate: '2024-03-02',
    executionStatus: 'Passed',
    actualStatus: 'Success',
    tester: 'John Doe',
    retestStatus: null,
    retestDate: null
  },
  {
    id: 'TC002',
    workstream: 'Payment',
    name: 'Process Credit Card Payment',
    description: 'Verify payment processing with valid credit card information.',
    steps: [
      'Add items to cart',
      'Proceed to checkout',
      'Enter payment details',
      'Submit payment'
    ],
    expectedResults: 'Payment should be processed successfully',
    type: 'Integration',
    plannedDate: '2024-03-03',
    actualDate: '2024-03-05',
    executionStatus: 'Failed',
    actualStatus: 'Failure',
    failedStatusDescription: 'Payment gateway timeout',
    tester: 'Jane Smith',
    retestStatus: 'Pending',
    retestDate: '2024-03-08'
  }
];

const mockDefects = [
  {
    id: 'BUG-001',
    title: 'Login page not responsive on mobile devices',
    severity: 'High',
    status: 'Open',
    owner: 'Development Team',
    createdAt: '2024-03-01T10:30:00.000Z',
    updatedAt: '2024-03-02T14:20:00.000Z',
    relatedTestCaseId: 'TC001'
  },
  {
    id: 'BUG-002',
    title: 'Payment gateway connection timeout',
    severity: 'Critical',
    status: 'Assigned',
    owner: 'Backend Team',
    createdAt: '2024-03-03T09:15:00.000Z',
    updatedAt: '2024-03-03T16:45:00.000Z',
    relatedTestCaseId: 'TC002'
  }
];

const mockDashboardData = {
  kpis: {
    totalProjects: { value: 12, subtitle: '8 active' },
    testsCompleted: { value: 1247, subtitle: '+12% this week' },
    pendingBugs: { value: 23, subtitle: 'Need attention' },
    teamMembers: { value: 32, subtitle: 'Active contributors' }
  },
  weeklyActivity: [
    { day: 'Mon', tests: 45 },
    { day: 'Tue', tests: 52 },
    { day: 'Wed', tests: 38 },
    { day: 'Thu', tests: 61 },
    { day: 'Fri', tests: 55 },
    { day: 'Sat', tests: 23 },
    { day: 'Sun', tests: 18 }
  ],
  bugDistribution: {
    critical: { count: 3, percentage: 13 },
    high: { count: 8, percentage: 35 },
    medium: { count: 12, percentage: 52 }
  }
};

// API functions
export async function getDashboardSummary() {
  try {
    const resKpis = await fetch(`${API_BASE}/reports/kpis`, { headers: { ...authHeaders() } });
    const kpis = resKpis.ok ? await resKpis.json() : null;

    const resProj = await fetch(`${API_BASE}/projects?limit=3`, { headers: { ...authHeaders() } });
    const projects = resProj.ok ? await resProj.json() : { items: [] };

    const resWeekly = await fetch(`${API_BASE}/reports/weekly-activity`, { headers: { ...authHeaders() } });
    const weeklyActivityRes = resWeekly.ok ? await resWeekly.json() : null;
    const weeklyActivity = Array.isArray(weeklyActivityRes) && weeklyActivityRes.length > 0
      ? weeklyActivityRes
      : mockDashboardData.weeklyActivity;

    const resBug = await fetch(`${API_BASE}/reports/bug-distribution`, { headers: { ...authHeaders() } });
    const bugDistributionRes = resBug.ok ? await resBug.json() : null;
    const bugDistribution = bugDistributionRes && bugDistributionRes.critical
      ? bugDistributionRes
      : mockDashboardData.bugDistribution;

    return {
      kpis: kpis && kpis.totalProjects ? kpis : mockDashboardData.kpis,
      weeklyActivity,
      bugDistribution,
      recentProjects: Array.isArray(projects.items) && projects.items.length > 0 ? projects.items : mockProjects,
    };
  } catch (e) {
    return {
      kpis: mockDashboardData.kpis,
      weeklyActivity: mockDashboardData.weeklyActivity,
      bugDistribution: mockDashboardData.bugDistribution,
      recentProjects: mockProjects,
    };
  }
}

export async function listProjects() {
  const res = await fetch(`${API_BASE}/projects`, { headers: { 'Content-Type':'application/json', ...authHeaders() } });
  const data = await res.json();
  return data.items || [];
}

export async function getProject(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}`, { headers: { ...authHeaders() } });
  if(!res.ok) throw new Error('Not found');
  return res.json();
}

export async function listProjectTestCases(projectId, filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE}/test-cases?projectId=${encodeURIComponent(projectId)}&${params}`, { headers: { ...authHeaders() } });
  const data = await res.json();
  const items = data.items || [];
  // Fetch steps for each test case
  const withSteps = await Promise.all(items.map(async (tc) => {
    try {
      const resSteps = await fetch(`${API_BASE}/test-cases/${tc.tcId}/steps`, { headers: { ...authHeaders() } });
      if(resSteps.ok){
        const s = await resSteps.json();
        return { ...tc, steps: s.steps || [], expectedResults: s.expectedResults || '' };
      }
    } catch {}
    return tc;
  }));
  return withSteps;
}

export async function listProjectTestCycles(projectId) {
  const res = await fetch(`${API_BASE}/test-cycles?projectId=${encodeURIComponent(projectId)}`, { headers: { ...authHeaders() } });
  const data = await res.json();
  return data.items || [];
}

export async function listProjectExecutions(projectId) {
  const res = await fetch(`${API_BASE}/executions?projectId=${encodeURIComponent(projectId)}`, { headers: { ...authHeaders() } });
  const data = await res.json();
  return data.items || [];
}

export async function listProjectDefects(projectId, filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE}/defects?projectId=${encodeURIComponent(projectId)}&${params}`, { headers: { ...authHeaders() } });
  const data = await res.json();
  return data.items || [];
}

export async function listProjectReports(projectId) {
  const res = await fetch(`${API_BASE}/reports?projectId=${encodeURIComponent(projectId)}`, { headers: { ...authHeaders() } });
  const data = await res.json();
  return data.items || [];
}

export async function listProjectParameters(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}`, { headers: { ...authHeaders() } });
  if(!res.ok) return {};
  const data = await res.json();
  // Map key/value rows into the shape ParametersTab expects
  const paramRows = data.parameters || [];
  const params = {};
  for(const row of paramRows){
    const key = row.param_key;
    let value = row.param_value;
    if(row.param_type === 'JSON'){
      try { value = JSON.parse(row.param_value); } catch {}
    } else if(key === 'tools'){
      value = String(value || '').split(';').map(s=>s.trim()).filter(Boolean);
    } else if(key === 'test_type'){
      params.testType = value;
      continue;
    } else if(key === 'test_mode'){
      params.testMode = value;
      continue;
    }
    params[key] = value;
  }
  return params;
}

export async function listProjectTeam(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}`, { headers: { ...authHeaders() } });
  if(!res.ok) return [];
  const data = await res.json();
  return data.members || [];
}