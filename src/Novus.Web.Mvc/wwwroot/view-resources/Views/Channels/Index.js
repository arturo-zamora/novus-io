(function () {
    $(function () {

        var _channelService = abp.services.app.channel;
        var _$modal = $('#ChannelCreateModal');
        var _$form = _$modal.find('form');

        _$form.validate();

        $('#RefreshButton').click(function () {
            refreshChannelList();
        });
        

        $('.delete-channel').click(function () {
            var channelId = $(this).attr("data-channel-id");
            var channelName = $(this).attr('data-channel-name');

            deleteChannel(channelId, channelName);
        });
        
        
        $('.edit-channel').click(function (e) {
            var channelId = $(this).attr("data-channel-id");

            e.preventDefault();
            $.ajax({
                url: abp.appPath + 'Channels/EditChannelModal?channelId=' + channelId,
                type: 'POST',
                contentType: 'application/html',
                success: function (content) {
                    $('#ChannelEditModal div.modal-content').html(content);
                },
                error: function (e) { }
            });
        });
        
            
            _$form.find('button[type="submit"]').click(function (e) {
            e.preventDefault();

            if (!_$form.valid()) {
                return;
            }

            var channel = _$form.serializeFormToObject(); //serializeFormToObject is defined in main.js

            abp.ui.setBusy(_$modal);
                _channelService.create(channel).done(function () {
                _$modal.modal('hide');
                location.reload(true); //reload page to see new tenant!
            }).always(function () {
                abp.ui.clearBusy(_$modal);
            });
        });

        _$modal.on('shown.bs.modal', function () {
            _$modal.find('input:not([type=hidden]):first').focus();
        });

        function refreshChannelList() {
            location.reload(true); //reload page to see new tenant!
        }

        function deleteChannel(channelId, channelName) {
            abp.message.confirm(
                "Delete channel '" + channelName + "'?",
                function (isConfirmed) {
                    if (isConfirmed) {
                        _channelService.delete({
                            id: channelId
                        }).done(function () {
                            refreshChannelList();
                        });
                    }
                }
            );
        }
        
    });
})();