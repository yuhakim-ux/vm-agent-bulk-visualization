// Sample Data Structure based on Salesforce NPSP VM hierarchy
const sampleData = {
    initiatives: [
        {
            id: 'init_1',
            name: 'Community Food Drive 2024',
            status: 'Active',
            startDate: '2024-01-15',
            endDate: '2024-12-31',
            description: 'Year-long community food collection initiative',
            positions: [
                {
                    id: 'pos_1',
                    name: 'Food Drive Coordinator',
                    status: 'Active',
                    skillsRequired: 'Event Planning, Leadership',
                    hoursPerWeek: '10-15',
                    shifts: [
                        {
                            id: 'shift_1',
                            name: 'Weekend Collection Setup',
                            startTime: '2024-03-01T08:00:00',
                            endTime: '2024-03-01T12:00:00',
                            location: 'Community Center Main Hall',
                            status: 'Active',
                            assignments: [
                                { id: 'assign_1', volunteerName: 'Sarah Johnson', email: 'sarah.j@email.com', status: 'Confirmed' },
                                { id: 'assign_2', volunteerName: 'Mike Chen', email: 'mike.c@email.com', status: 'Confirmed' },
                                { id: 'assign_3', volunteerName: 'Lisa Rodriguez', email: 'lisa.r@email.com', status: 'Pending' }
                            ]
                        },
                        {
                            id: 'shift_2',
                            name: 'Food Sorting & Packaging',
                            startTime: '2024-03-01T13:00:00',
                            endTime: '2024-03-01T17:00:00',
                            location: 'Community Center Storage Room',
                            status: 'Active',
                            assignments: [
                                { id: 'assign_4', volunteerName: 'David Park', email: 'david.p@email.com', status: 'Confirmed' },
                                { id: 'assign_5', volunteerName: 'Emma Wilson', email: 'emma.w@email.com', status: 'Confirmed' },
                                { id: 'assign_6', volunteerName: 'James Miller', email: 'james.m@email.com', status: 'Confirmed' },
                                { id: 'assign_7', volunteerName: 'Anna Thompson', email: 'anna.t@email.com', status: 'Waitlist' }
                            ]
                        }
                    ]
                },
                {
                    id: 'pos_2',
                    name: 'Collection Site Manager',
                    status: 'Active',
                    skillsRequired: 'Customer Service, Organization',
                    hoursPerWeek: '8-12',
                    shifts: [
                        {
                            id: 'shift_3',
                            name: 'Morning Collection Shift',
                            startTime: '2024-03-02T09:00:00',
                            endTime: '2024-03-02T13:00:00',
                            location: 'Grocery Store Entrance',
                            status: 'Active',
                            assignments: [
                                { id: 'assign_8', volunteerName: 'Robert Davis', email: 'robert.d@email.com', status: 'Confirmed' },
                                { id: 'assign_9', volunteerName: 'Karen White', email: 'karen.w@email.com', status: 'Confirmed' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'init_2',
            name: 'Youth Mentorship Program',
            status: 'Active',
            startDate: '2024-02-01',
            endDate: '2024-11-30',
            description: 'After-school mentorship and tutoring program',
            positions: [
                {
                    id: 'pos_3',
                    name: 'Academic Tutor',
                    status: 'Active',
                    skillsRequired: 'Teaching Experience, Math/Science',
                    hoursPerWeek: '6-8',
                    shifts: [
                        {
                            id: 'shift_4',
                            name: 'Monday Math Tutoring',
                            startTime: '2024-03-04T15:30:00',
                            endTime: '2024-03-04T17:30:00',
                            location: 'Lincoln Elementary School',
                            status: 'Active',
                            assignments: [
                                { id: 'assign_10', volunteerName: 'Dr. Patricia Green', email: 'patricia.g@email.com', status: 'Confirmed' },
                                { id: 'assign_11', volunteerName: 'Tom Anderson', email: 'tom.a@email.com', status: 'Confirmed' }
                            ]
                        },
                        {
                            id: 'shift_5',
                            name: 'Wednesday Science Lab',
                            startTime: '2024-03-06T15:30:00',
                            endTime: '2024-03-06T17:30:00',
                            location: 'Lincoln Elementary School',
                            status: 'Active',
                            assignments: [
                                { id: 'assign_12', volunteerName: 'Jennifer Lee', email: 'jennifer.l@email.com', status: 'Confirmed' },
                                { id: 'assign_13', volunteerName: 'Carlos Martinez', email: 'carlos.m@email.com', status: 'Pending' },
                                { id: 'assign_14', volunteerName: 'Michelle Brown', email: 'michelle.b@email.com', status: 'Confirmed' }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

// Global state
let currentView = 'tree';
let currentTab = 'initiatives';
let expandedNodes = new Set(['init_1', 'init_2']); // Initially expand root nodes

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function getStatusClass(status) {
    const statusClasses = {
        'Active': 'status-active',
        'Confirmed': 'status-confirmed',
        'Pending': 'status-pending',
        'Waitlist': 'status-waitlist',
        'Cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-default';
}

// Calculate totals for the summary
function calculateTotals() {
    let totals = {
        initiatives: sampleData.initiatives.length,
        positions: 0,
        shifts: 0,
        assignments: 0
    };

    sampleData.initiatives.forEach(initiative => {
        totals.positions += initiative.positions.length;
        
        initiative.positions.forEach(position => {
            totals.shifts += position.shifts.length;
            
            position.shifts.forEach(shift => {
                totals.assignments += shift.assignments.length;
            });
        });
    });

    return totals;
}

// Modal functions
function openVisualization() {
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize the tree view
    renderTreeView();
    renderListView();
}

function closeVisualization() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function switchView(view) {
    currentView = view;
    
    // Update button states
    document.getElementById('treeViewBtn').classList.toggle('active', view === 'tree');
    document.getElementById('listViewBtn').classList.toggle('active', view === 'list');
    
    // Show/hide views
    document.getElementById('treeView').style.display = view === 'tree' ? 'block' : 'none';
    document.getElementById('listView').style.display = view === 'list' ? 'block' : 'none';
    
    // Show/hide tree controls
    document.getElementById('treeControls').style.display = view === 'tree' ? 'flex' : 'none';
}

// Tree view functions
function renderTreeView() {
    const container = document.getElementById('hierarchyTree');
    container.innerHTML = '';
    
    // Add header for volunteer initiatives
    if (sampleData.initiatives.length > 0) {
        const initiativesHeader = createSectionHeader('initiative', sampleData.initiatives.length);
        initiativesHeader.style.marginLeft = '0'; // Remove left margin for top level
        container.appendChild(initiativesHeader);
    }
    
    sampleData.initiatives.forEach(initiative => {
        const initiativeNode = createTreeNode(initiative, 'initiative', 'root');
        container.appendChild(initiativeNode);
    });
}

function createTreeNode(item, type, cssClass = '') {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'tree-node';
    
    const isExpanded = expandedNodes.has(item.id);
    const hasChildren = getChildrenCount(item, type) > 0;
    
    const nodeHeader = document.createElement('div');
    nodeHeader.className = `node-header ${cssClass} ${type}`;
    nodeHeader.onclick = () => toggleNode(item.id, nodeHeader.nextElementSibling);
    
    const toggleIcon = hasChildren ? 
        `<span class="expand-toggle ${isExpanded ? 'expanded' : ''}" id="toggle-${item.id}">
            <i class="fas fa-chevron-right"></i>
         </span>` : 
        '<span class="expand-toggle" style="opacity: 0.3;"><i class="fas fa-circle" style="font-size: 6px;"></i></span>';
    
    const icon = getNodeIcon(type);
    const childCount = getChildrenCount(item, type);
    const subtitle = getNodeSubtitle(item, type);
    
    nodeHeader.innerHTML = `
        ${toggleIcon}
        <span class="node-icon">${icon}</span>
        <div class="node-info">
            <div>
                <div class="node-title">${item.name}</div>
                ${subtitle ? `<div class="node-subtitle">${subtitle}</div>` : ''}
            </div>
            ${childCount > 0 ? `<span class="node-count">${childCount}</span>` : ''}
        </div>
    `;
    
    nodeDiv.appendChild(nodeHeader);
    
    if (hasChildren) {
        const childrenDiv = document.createElement('div');
        childrenDiv.className = `node-children ${isExpanded ? 'expanded' : ''}`;
        childrenDiv.id = `children-${item.id}`;
        
        if (isExpanded) {
            renderChildren(childrenDiv, item, type);
        }
        
        nodeDiv.appendChild(childrenDiv);
    }
    
    return nodeDiv;
}

function getNodeIcon(type) {
    const icons = {
        'initiative': '<i class="fas fa-heart"></i>',
        'position': '<i class="fas fa-briefcase"></i>',
        'shift': '<i class="fas fa-clock"></i>',
        'assignment': '<i class="fas fa-user"></i>'
    };
    return icons[type] || '<i class="fas fa-circle"></i>';
}

function getNodeSubtitle(item, type) {
    switch (type) {
        case 'initiative':
            return `${formatDate(item.startDate)} - ${formatDate(item.endDate)} • ${item.status}`;
        case 'position':
            return `${item.hoursPerWeek} hrs/week • ${item.status}`;
        case 'shift':
            return `${formatDateTime(item.startTime)} • ${item.location}`;
        case 'assignment':
            return `${item.email} • ${item.status}`;
        default:
            return '';
    }
}

function getChildrenCount(item, type) {
    switch (type) {
        case 'initiative':
            return item.positions ? item.positions.length : 0;
        case 'position':
            return item.shifts ? item.shifts.length : 0;
        case 'shift':
            return item.assignments ? item.assignments.length : 0;
        default:
            return 0;
    }
}

function renderChildren(container, parent, parentType) {
    let children = [];
    let childType = '';
    
    switch (parentType) {
        case 'initiative':
            children = parent.positions || [];
            childType = 'position';
            break;
        case 'position':
            children = parent.shifts || [];
            childType = 'shift';
            break;
        case 'shift':
            children = parent.assignments || [];
            childType = 'assignment';
            break;
    }
    
    // Add section header if there are children
    if (children.length > 0) {
        const sectionHeader = createSectionHeader(childType, children.length);
        container.appendChild(sectionHeader);
    }
    
    children.forEach(child => {
        const childNode = createTreeNode(child, childType);
        container.appendChild(childNode);
    });
}

function createSectionHeader(recordType, count) {
    const header = document.createElement('div');
    header.className = 'section-header';
    
    const typeInfo = getSectionHeaderInfo(recordType);
    
    header.innerHTML = `
        <div class="section-header-content">
            <span class="section-icon">${typeInfo.icon}</span>
            <span class="section-title">${typeInfo.title}</span>
            <span class="section-count">${count}</span>
        </div>
    `;
    
    return header;
}

function getSectionHeaderInfo(recordType) {
    const headerInfo = {
        'initiative': {
            icon: '<i class="fas fa-heart"></i>',
            title: 'Volunteer Initiatives'
        },
        'position': {
            icon: '<i class="fas fa-briefcase"></i>',
            title: 'Job Positions'
        },
        'shift': {
            icon: '<i class="fas fa-clock"></i>',
            title: 'Job Position Shifts'
        },
        'assignment': {
            icon: '<i class="fas fa-user"></i>',
            title: 'Job Position Assignments'
        }
    };
    
    return headerInfo[recordType] || { icon: '<i class="fas fa-circle"></i>', title: 'Records' };
}

function toggleNode(nodeId, childrenDiv) {
    const isExpanded = expandedNodes.has(nodeId);
    const toggleIcon = document.getElementById(`toggle-${nodeId}`);
    
    if (isExpanded) {
        expandedNodes.delete(nodeId);
        childrenDiv.classList.remove('expanded');
        toggleIcon.classList.remove('expanded');
    } else {
        expandedNodes.add(nodeId);
        childrenDiv.classList.add('expanded');
        toggleIcon.classList.add('expanded');
        
        // Lazy load children if not already rendered
        if (childrenDiv.children.length === 0) {
            // Find the parent item and render its children
            const parentItem = findItemById(nodeId);
            if (parentItem) {
                const type = getItemType(nodeId);
                renderChildren(childrenDiv, parentItem.item, type);
            }
        }
    }
}

function findItemById(id) {
    // Search through the data structure to find the item by ID
    for (let initiative of sampleData.initiatives) {
        if (initiative.id === id) {
            return { item: initiative, type: 'initiative' };
        }
        
        for (let position of initiative.positions || []) {
            if (position.id === id) {
                return { item: position, type: 'position' };
            }
            
            for (let shift of position.shifts || []) {
                if (shift.id === id) {
                    return { item: shift, type: 'shift' };
                }
                
                for (let assignment of shift.assignments || []) {
                    if (assignment.id === id) {
                        return { item: assignment, type: 'assignment' };
                    }
                }
            }
        }
    }
    return null;
}

function getItemType(id) {
    if (id.startsWith('init_')) return 'initiative';
    if (id.startsWith('pos_')) return 'position';
    if (id.startsWith('shift_')) return 'shift';
    if (id.startsWith('assign_')) return 'assignment';
    return '';
}

function expandAll() {
    // Add all IDs to expanded set
    sampleData.initiatives.forEach(initiative => {
        expandedNodes.add(initiative.id);
        (initiative.positions || []).forEach(position => {
            expandedNodes.add(position.id);
            (position.shifts || []).forEach(shift => {
                expandedNodes.add(shift.id);
            });
        });
    });
    renderTreeView();
}

function collapseAll() {
    // Keep only root initiatives expanded
    expandedNodes.clear();
    sampleData.initiatives.forEach(initiative => {
        expandedNodes.add(initiative.id);
    });
    renderTreeView();
}

// List view functions
function renderListView() {
    renderInitiativesList();
    renderPositionsList();
    renderShiftsList();
    renderAssignmentsList();
}

function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab states
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    document.querySelector(`.tab:nth-child(${getTabIndex(tabName)})`).classList.add('active');
    document.getElementById(`${tabName}List`).classList.add('active');
}

function getTabIndex(tabName) {
    const tabs = ['initiatives', 'positions', 'shifts', 'assignments'];
    return tabs.indexOf(tabName) + 1;
}

function renderInitiativesList() {
    const container = document.getElementById('initiativesList');
    container.innerHTML = '<div class="record-list"></div>';
    const listContainer = container.querySelector('.record-list');
    
    sampleData.initiatives.forEach(initiative => {
        const card = createRecordCard(initiative, 'initiative');
        listContainer.appendChild(card);
    });
}

function renderPositionsList() {
    const container = document.getElementById('positionsList');
    container.innerHTML = '<div class="record-list"></div>';
    const listContainer = container.querySelector('.record-list');
    
    sampleData.initiatives.forEach(initiative => {
        (initiative.positions || []).forEach(position => {
            const card = createRecordCard({...position, initiativeName: initiative.name}, 'position');
            listContainer.appendChild(card);
        });
    });
}

function renderShiftsList() {
    const container = document.getElementById('shiftsList');
    container.innerHTML = '<div class="record-list"></div>';
    const listContainer = container.querySelector('.record-list');
    
    sampleData.initiatives.forEach(initiative => {
        (initiative.positions || []).forEach(position => {
            (position.shifts || []).forEach(shift => {
                const card = createRecordCard({
                    ...shift, 
                    initiativeName: initiative.name,
                    positionName: position.name
                }, 'shift');
                listContainer.appendChild(card);
            });
        });
    });
}

function renderAssignmentsList() {
    const container = document.getElementById('assignmentsList');
    container.innerHTML = '<div class="record-list"></div>';
    const listContainer = container.querySelector('.record-list');
    
    sampleData.initiatives.forEach(initiative => {
        (initiative.positions || []).forEach(position => {
            (position.shifts || []).forEach(shift => {
                (shift.assignments || []).forEach(assignment => {
                    const card = createRecordCard({
                        ...assignment,
                        initiativeName: initiative.name,
                        positionName: position.name,
                        shiftName: shift.name,
                        shiftTime: shift.startTime
                    }, 'assignment');
                    listContainer.appendChild(card);
                });
            });
        });
    });
}

function createRecordCard(item, type) {
    const card = document.createElement('div');
    card.className = 'record-item';
    
    const icon = getNodeIcon(type);
    const content = getCardContent(item, type);
    
    card.innerHTML = `
        <div class="record-header">
            ${icon}
            <span class="record-title">${item.name || item.volunteerName}</span>
        </div>
        ${content}
        <div class="record-status ${getStatusClass(item.status)}">${item.status}</div>
    `;
    
    return card;
}

function getCardContent(item, type) {
    switch (type) {
        case 'initiative':
            return `
                <div class="record-meta">
                    ${formatDate(item.startDate)} - ${formatDate(item.endDate)}<br>
                    ${item.description}
                </div>
            `;
        case 'position':
            return `
                <div class="record-meta">
                    Initiative: ${item.initiativeName}<br>
                    Hours/Week: ${item.hoursPerWeek}<br>
                    Skills: ${item.skillsRequired}
                </div>
            `;
        case 'shift':
            return `
                <div class="record-meta">
                    Initiative: ${item.initiativeName}<br>
                    Position: ${item.positionName}<br>
                    Time: ${formatDateTime(item.startTime)}<br>
                    Location: ${item.location}
                </div>
            `;
        case 'assignment':
            return `
                <div class="record-meta">
                    Initiative: ${item.initiativeName}<br>
                    Position: ${item.positionName}<br>
                    Shift: ${item.shiftName}<br>
                    Time: ${formatDateTime(item.shiftTime)}<br>
                    Email: ${item.email}
                </div>
            `;
        default:
            return '';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const totals = calculateTotals();
    
    // Update the summary counts in the UI
    const countItems = document.querySelectorAll('.count-item .count');
    if (countItems.length >= 4) {
        countItems[0].textContent = totals.initiatives;
        countItems[1].textContent = totals.positions;
        countItems[2].textContent = totals.shifts;
        countItems[3].textContent = totals.assignments;
    }
    
    // Update total impact
    const totalImpact = totals.initiatives + totals.positions + totals.shifts + totals.assignments;
    document.querySelector('.total-impact').textContent = `Total Impact: ${totalImpact} records will be updated`;
    
    // Close modal when clicking outside
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeVisualization();
        }
    });
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('modalOverlay').classList.contains('active')) {
            closeVisualization();
        }
    });
    
    // Add some dynamic messaging to the chat
    setTimeout(() => {
        const chatMessages = document.getElementById('chatMessages');
        const newMessage = document.createElement('div');
        newMessage.className = 'message bot-message fade-in';
        newMessage.innerHTML = `
            <div class="message-content">
                <p>Analysis complete! I found <strong>${totalImpact} total records</strong> that will be affected by this bulk cancellation. Please review the impact summary below.</p>
            </div>
        `;
        chatMessages.appendChild(newMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
});

// Add CSS for status classes
const statusStyles = document.createElement('style');
statusStyles.textContent = `
    .status-active { background: #e8f5e8; color: #2e844a; }
    .status-confirmed { background: #e8f4fd; color: #0176d3; }
    .status-pending { background: #fef7e8; color: #fe9339; }
    .status-waitlist { background: #f3e8ff; color: #8b5cf6; }
    .status-cancelled { background: #ffebee; color: #c62d42; }
    .status-default { background: #f4f6f9; color: #706e6b; }
`;
document.head.appendChild(statusStyles); 