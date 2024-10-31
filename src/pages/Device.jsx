  <AddDeviceModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAddDevice={handleAddDevice}
            />
            <EditDeviceModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                device={deviceToEdit}
                onEditDevice={handleEditDevice}
            />
            <DeleteDeviceModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDeleteDevice={handleDeleteDevice}
                device={deviceToDelete}
            />
        </div>
    );
