// Sample Data Structure based on Salesforce NPSP VM hierarchy
const sampleData = {
    initiatives: [
        {
            id: 'init_1',
            name: 'Community Food Drive 2024',
            status: 'In Progress',
            startDate: '2024-01-15',
            endDate: '2024-12-31',
            description: 'Year-long community food collection initiative',
            positions: [
                {
                    id: 'pos_1',
                    name: 'Food Drive Coordinator',
                    status: 'In Progress',
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
                                { id: 'assign_3', volunteerName: 'Lisa Rodriguez', email: 'lisa.r@email.com', status: 'Upcoming' }
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
                                { id: 'assign_4', volunteerName: 'David Park', email: 'david.p@email.com', status: 'Confirmed' }
                            ]
                        },
                        {
                            id: 'shift_3',
                            name: 'Distribution Coordination',
                            startTime: '2024-03-02T08:00:00',
                            endTime: '2024-03-02T12:00:00',
                            location: 'Community Center Main Hall',
                            status: 'Active',
                            assignments: [
                                { id: 'assign_7', volunteerName: 'Lisa Chen', email: 'lisa.c@email.com', status: 'Confirmed' }
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
        }
    ]
};

// Global state
let currentView = 'tree';
let currentTab = 'initiatives';
let expandedNodes = new Set(['init_1']); // Initially expand root nodes
let isChatPanelCollapsed = false;
let currentViewMode = 'initiative'; // 'initiative' or 'position'

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
        'Canceled': 'status-canceled'
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

// Agentforce Modal functions
function openAgentforce() {
    document.getElementById('agentforceModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Initialize chat messages
    initializeChatMessages();
    
    // Add Enter key listener to chat input
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Initialize the tree visualization only
    renderTreeView();
    
    // Set initial view state
    switchView('tree');
}

function closeAgentforce() {
    document.getElementById('agentforceModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Chat Panel functions
function toggleChatPanel() {
    const chatPanel = document.getElementById('chatPanel');
    const chatExpandBtn = document.getElementById('chatExpandBtn');
    const chatToggleIcon = document.getElementById('chatToggleIcon');
    
    isChatPanelCollapsed = !isChatPanelCollapsed;
    
    if (isChatPanelCollapsed) {
        chatPanel.classList.add('collapsed');
        chatExpandBtn.style.display = 'block';
        chatToggleIcon.className = 'fas fa-chevron-left';
    } else {
        chatPanel.classList.remove('collapsed');
        chatExpandBtn.style.display = 'none';
        chatToggleIcon.className = 'fas fa-chevron-right';
    }
}

// Chat Message functions
function initializeChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    // Add initial messages
    addMessage('user', 'I want to cancel the Community Food Drive 2024 initiative.');
    
    setTimeout(() => {
        addMessage('agent', 'Canceling the Community Food Drive 2024 initiative will impact a total of 15 records:\n\n• 1 Volunteer Initiative: The initiative will be canceled\n• 2 Job Positions: All associated positions will be canceled\n• 3 Job Position Shifts: All scheduled shifts will be removed\n• 9 Job Position Assignments: All volunteer assignments will be canceled\n\nWould you like to view a detailed visualization to explore the full hierarchy and see which records will be affected?\nOr let me know if you\'d just like to proceed with the cancellation.');
    }, 800);
    
    setTimeout(() => {
        addMessage('user', 'Hmm, show me the visualization.');
    }, 2500);
}

function addMessage(type, content) {
    const chatMessages = document.getElementById('chatMessages');
    const message = document.createElement('div');
    message.className = `message ${type}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${type}`;
    avatar.innerHTML = type === 'agent' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = content.replace(/\n/g, '<br>');
    
    const messageContent = document.createElement('div');
    messageContent.style.flex = '1';
    messageContent.appendChild(bubble);
    
    // Add timestamp
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageContent.appendChild(time);
    
    message.appendChild(avatar);
    message.appendChild(messageContent);
    
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage('user', message);
        input.value = '';
        
        // Check if user wants to switch to position-level cancellation
        if (message.toLowerCase().includes('food drive coordinator') && 
            message.toLowerCase().includes('not the initiative')) {
            
            setTimeout(() => {
                addMessage('agent', 'Got it! Canceling Food Drive Coordinator will impact a total of 8 records:\n\n• 1 Job Position: The position will be canceled\n• 3 Job Shifts: All scheduled shifts will be removed\n• 4 Job Position Assignments: All volunteer assignments will be canceled\n\nI\'ve updated the visualization to reflect the impact of canceling this position. Let me know if you\'d like to proceed with the cancellation!');
                
                // Update the visualization to show position-level impact
                updateVisualizationForPosition();
            }, 1000);
            
        } else {
            // Default agent response for other messages
            setTimeout(() => {
                addMessage('agent', 'I understand your question. The visualization on the right shows the current analysis. Is there anything specific you\'d like me to explain about the impact?');
            }, 1000);
        }
    }
}

// Function to update visualization for position-level view
function updateVisualizationForPosition() {
    currentViewMode = 'position';
    
    // Update header
    const headerElement = document.querySelector('.viz-header h3');
    if (headerElement) {
        headerElement.textContent = '8 records will be updated';
    }
    
    // Update expanded nodes for position view
    expandedNodes.clear();
    expandedNodes.add('init_1'); // Keep initiative visible but not expanded
    expandedNodes.add('pos_1'); // Expand the target position
    
    // Re-render the tree view
    renderTreeView();
    renderListView();
}

// Function to determine if a node should be grayed out
function shouldNodeBeGrayedOut(item, type) {
    if (currentViewMode !== 'position') {
        return false; // No graying out in initiative mode
    }
    
    // In position mode, gray out the initiative and non-target positions
    if (type === 'initiative') {
        return true; // Initiative is not being cancelled, so gray it out
    }
    
    if (type === 'position' && item.id === 'pos_2') {
        return true; // Collection Site Manager is not being cancelled
    }
    
    return false; // All other nodes (target position, shifts, assignments) show normally
}

function switchView(view) {
    currentView = view;
    
    // Update button states using SLDS classes
    const treeBtn = document.getElementById('treeViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    
    treeBtn.classList.toggle('active', view === 'tree');
    listBtn.classList.toggle('active', view === 'list');
    
    // Show/hide views
    document.getElementById('treeView').style.display = view === 'tree' ? 'block' : 'none';
    document.getElementById('listView').style.display = view === 'list' ? 'block' : 'none';
    
    // Show/hide tree controls
    document.getElementById('treeControls').style.display = view === 'tree' ? 'flex' : 'none';
    
    // Initialize the first tab when switching to List View
    if (view === 'list') {
        switchTab('initiatives');
    }
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
    
    // Determine if this node should be grayed out
    const isGrayedOut = shouldNodeBeGrayedOut(item, type);
    const grayedClass = isGrayedOut ? 'grayed-out' : '';
    
    const nodeHeader = document.createElement('div');
    nodeHeader.className = `node-header ${cssClass} ${type} ${grayedClass}`;
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
    
    // In position mode, only show children for the target position and its descendants
    if (currentViewMode === 'position' && parentType === 'initiative') {
        // Only show the target position (Food Drive Coordinator)
        children = children.filter(child => child.id === 'pos_1');
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
    // Keep only root initiative expanded
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
    // Simple test to verify function is called
    console.log('switchTab called with:', tabName);
    
    currentTab = tabName;
    
    // Update SLDS tab states
    document.querySelectorAll('.slds-tabs_default__item').forEach(item => item.classList.remove('slds-is-active'));
    document.querySelectorAll('.slds-tabs_default__content').forEach(content => {
        content.classList.remove('slds-show');
        content.classList.add('slds-hide');
    });
    
    // Find and activate the correct tab
    const tabs = ['initiatives', 'positions', 'shifts', 'assignments'];
    const tabIndex = tabs.indexOf(tabName);
    
    if (tabIndex !== -1) {
        document.querySelectorAll('.slds-tabs_default__item')[tabIndex].classList.add('slds-is-active');
        const contentElement = document.getElementById(`${tabName}List`);
        console.log('Looking for container:', `${tabName}List`);
        console.log('Found container:', contentElement);
        
        if (contentElement) {
            contentElement.classList.remove('slds-hide');
            contentElement.classList.add('slds-show');
            
            // Render the content for the selected tab
            switch (tabName) {
                case 'initiatives':
                    console.log('About to call renderInitiativesList');
                    renderInitiativesList();
                    break;
                case 'positions':
                    renderPositionsList();
                    break;
                case 'shifts':
                    renderShiftsList();
                    break;
                case 'assignments':
                    renderAssignmentsList();
                    break;
            }
        } else {
            console.error('Container not found:', `${tabName}List`);
        }
    }
}

function renderInitiativesList() {
    try {
        console.log('renderInitiativesList: Starting...');
        const container = document.getElementById('initiativesList');
        console.log('renderInitiativesList: Container found:', container);
        
        if (!container) {
            alert('Container "initiativesList" not found!');
            return;
        }
        
        console.log('renderInitiativesList: About to check sampleData...');
        console.log('renderInitiativesList: sampleData:', sampleData);
        console.log('renderInitiativesList: sampleData.initiatives:', sampleData.initiatives);
        
        // Simple test - just put some text
        const testHtml = '<div style="padding: 20px; background: yellow; border: 2px solid red;"><h3>TEST: renderInitiativesList was called!</h3><p>Container found successfully!</p><p>Sample data has ' + sampleData.initiatives.length + ' initiatives</p></div>';
        
        console.log('renderInitiativesList: About to set innerHTML...');
        container.innerHTML = testHtml;
        console.log('renderInitiativesList: innerHTML set successfully!');
        console.log('renderInitiativesList: Container now contains:', container.innerHTML);
        
    } catch (error) {
        console.error('Error in renderInitiativesList:', error);
        alert('Error in renderInitiativesList: ' + error.message);
    }
}

function renderPositionsList() {
    const container = document.getElementById('positionsList');
    const positions = [];
    
    sampleData.initiatives.forEach(initiative => {
        (initiative.positions || []).forEach(position => {
            // Only show positions that will be affected based on current view mode
            const isAffected = currentViewMode === 'initiative' || 
                              (currentViewMode === 'position' && position.id === 'pos_1');
            
            positions.push({
                id: position.id,
                name: position.name,
                currentStatus: position.status,
                plannedStatus: isAffected ? 'Canceled' : position.status,
                isAffected: isAffected
            });
        });
    });
    
    container.innerHTML = createDataTable('position', positions, [
        { key: 'name', label: 'Position Name', sortable: true, linked: true },
        { key: 'currentStatus', label: 'Current Status', sortable: true },
        { key: 'plannedStatus', label: 'Planned Status', sortable: true }
    ]);
}

function renderShiftsList() {
    const container = document.getElementById('shiftsList');
    const shifts = [];
    
    sampleData.initiatives.forEach(initiative => {
        (initiative.positions || []).forEach(position => {
            (position.shifts || []).forEach(shift => {
                // Only show shifts that will be affected based on current view mode
                const isAffected = currentViewMode === 'initiative' || 
                                  (currentViewMode === 'position' && position.id === 'pos_1');
                
                shifts.push({
                    id: shift.id,
                    name: shift.name,
                    currentStatus: shift.status,
                    plannedStatus: isAffected ? 'Canceled' : shift.status,
                    isAffected: isAffected
                });
            });
        });
    });
    
    container.innerHTML = createDataTable('shift', shifts, [
        { key: 'name', label: 'Shift Name', sortable: true, linked: true },
        { key: 'currentStatus', label: 'Current Status', sortable: true },
        { key: 'plannedStatus', label: 'Planned Status', sortable: true }
    ]);
}

function renderAssignmentsList() {
    const container = document.getElementById('assignmentsList');
    const assignments = [];
    
    sampleData.initiatives.forEach(initiative => {
        (initiative.positions || []).forEach(position => {
            (position.shifts || []).forEach(shift => {
                (shift.assignments || []).forEach(assignment => {
                    // Only show assignments that will be affected based on current view mode
                    const isAffected = currentViewMode === 'initiative' || 
                                      (currentViewMode === 'position' && position.id === 'pos_1');
                    
                    assignments.push({
                        id: assignment.id,
                        name: `${shift.name} - ${assignment.volunteerName}`,
                        currentStatus: assignment.status,
                        plannedStatus: isAffected ? 'Canceled' : assignment.status,
                        personAccount: assignment.volunteerName,
                        isAffected: isAffected
                    });
                });
            });
        });
    });
    
    container.innerHTML = createDataTable('assignment', assignments, [
        { key: 'name', label: 'Assignment', sortable: true, linked: true },
        { key: 'currentStatus', label: 'Current Status', sortable: true },
        { key: 'plannedStatus', label: 'Planned Status', sortable: true },
        { key: 'personAccount', label: 'Person Account', sortable: true, linked: true }
    ]);
}

// Data Table Creation Functions
function createDataTable(type, data, columns) {
    if (data.length === 0) {
        return '<div class="slds-text-align_center slds-p-around_medium slds-text-color_weak">No records to display</div>';
    }
    
    const tableId = `${type}-table`;
    let html = `
        <div style="padding: 1rem;">
            <h4 style="margin-bottom: 1rem;">Found ${data.length} ${type}(s)</h4>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                <thead style="background-color: #f5f5f5;">
                    <tr>
    `;
    
    // Generate simple table headers
    columns.forEach(column => {
        html += `<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${column.label}</th>`;
    });
    
    html += `
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Generate simple table rows
    data.forEach((item, index) => {
        html += `<tr style="background-color: ${index % 2 === 0 ? '#fff' : '#f9f9f9'};">`;
        
        columns.forEach(column => {
            let cellValue = item[column.key] || '';
            
            // Handle linked columns
            if (column.linked && cellValue) {
                cellValue = `<a href="#" style="color: #0176d3; text-decoration: none;">${cellValue}</a>`;
            }
            
            html += `<td style="border: 1px solid #ddd; padding: 8px;">${cellValue}</td>`;
        });
        
        html += '</tr>';
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Add event listeners for table interactions
function addTableEventListeners(tableId, type, data, columns) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Add sort event listeners
    const sortableHeaders = table.querySelectorAll('.sortable-header');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            sortTable(tableId, header.dataset.column, type, data, columns);
        });
        header.style.cursor = 'pointer';
    });
    
    // Add link click handlers
    const recordLinks = table.querySelectorAll('.record-link');
    recordLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Handle record link clicks - could open details modal, etc.
        });
    });
}

// Table sorting functionality
function sortTable(tableId, column, type, data, columns) {
    const table = document.getElementById(tableId);
    const header = table.querySelector(`[data-column="${column}"]`);
    const sortIcon = header.querySelector('.sort-icon');
    
    // Determine sort direction
    let sortDirection = 'asc';
    if (header.classList.contains('sort-asc')) {
        sortDirection = 'desc';
    } else if (header.classList.contains('sort-desc')) {
        sortDirection = 'asc';
    }
    
    // Clear all sort classes and icons
    table.querySelectorAll('.sortable-header').forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
        const icon = h.querySelector('.sort-icon');
        icon.className = 'fas fa-sort slds-m-left_x-small sort-icon';
    });
    
    // Apply sort class and icon
    header.classList.add(`sort-${sortDirection}`);
    sortIcon.className = `fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} slds-m-left_x-small sort-icon`;
    
    // Sort the data
    const sortedData = [...data].sort((a, b) => {
        let aVal = a[column] || '';
        let bVal = b[column] || '';
        
        // Convert to strings for comparison
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
        
        if (sortDirection === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });
    
    // Re-render table body with sorted data
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    
    sortedData.forEach((item) => {
        const rowClass = item.isAffected === false ? 'grayed-out-row' : '';
        let rowHtml = `<tr class="${rowClass}">`;
        
        columns.forEach(column => {
            let cellValue = item[column.key] || '';
            let cellClass = '';
            
            // Handle status columns - keep as plain text
            if (column.key === 'currentStatus' || column.key === 'plannedStatus') {
                cellClass = `status-cell`;
                // Keep as plain text, no badges
            }
            
            // Handle linked columns
            if (column.linked && cellValue) {
                const originalValue = item[column.key];
                cellValue = `<a href="#" class="slds-link record-link" data-id="${item.id}" data-type="${type}">${originalValue}</a>`;
            }
            
            rowHtml += `
                <td class="${cellClass}" data-label="${column.label}">
                    <div class="slds-truncate" title="${item[column.key] || ''}">${cellValue}</div>
                </td>
            `;
        });
        
        rowHtml += '</tr>';
        tbody.innerHTML += rowHtml;
    });
    
    // Re-add event listeners for links
    const recordLinks = table.querySelectorAll('.record-link');
    recordLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });
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
    
    // Update header dynamically
    const headerElement = document.querySelector('.viz-header h3');
    if (headerElement) {
        headerElement.textContent = `${totalImpact} records will be updated`;
    }
    
    // Close modal when clicking outside
    document.getElementById('agentforceModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAgentforce();
        }
    });
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('agentforceModal');
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeAgentforce();
        }
        
        // Enter to send message when input is focused
        if (e.key === 'Enter' && e.target.id === 'chatInput') {
            if (!e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        }
    });
    
    // Initialize with correct totals for the demo
});

// Status classes for basic styling (plain text only)
const statusStyles = document.createElement('style');
statusStyles.textContent = `
    .status-cell { font-weight: 500; color: #3e3e3c; }
`;
document.head.appendChild(statusStyles); 