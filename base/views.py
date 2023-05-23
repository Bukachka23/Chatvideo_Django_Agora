from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
import random
import time
from agora_token_builder import RtcTokenBuilder
from .models import RoomMember
import json
from django.views.decorators.csrf import csrf_exempt



# This function renders the `base/lobby.html` template.
def lobby(request):
    return render(request, 'base/lobby.html')


# This function renders the `base/room.html` template.
def room(request):
    return render(request, 'base/room.html')


# This function generates a token for the user to join the chat room.
def getToken(request):
    appId = "d96f80e9aae74632b0340048beb98c66"
    appCertificate = "ab8f95c42c5d4e68882eed101c09aba1"
    channelName = request.GET.get('channel')
    uid = random.randint(1, 230)
    expirationTimeInSeconds = 3600
    currentTimeStamp = int(time.time())
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)

    return JsonResponse({'token': token, 'uid': uid}, safe=False)


# This function creates a new room member.
@csrf_exempt
def createMember(request):
    data = json.loads(request.body)
    member, created = RoomMember.objects.get_or_create(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )

    return JsonResponse({'name':data['name']}, safe=False)


# This function gets a room member by their UID.
def getMember(request):
    uid = request.GET.get('UID')
    room_name = request.GET.get('room_name')

    member = RoomMember.objects.get(
        uid=uid,
        room_name=room_name,
    )
    name = member.name
    return JsonResponse({'name':member.name}, safe=False)


# This function deletes a room member.
@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    member = get_object_or_404(
        RoomMember,
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )
    member.delete()
    return JsonResponse('Member deleted', safe=False)
