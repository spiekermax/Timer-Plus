function genID(group)
{
    if(typeof genID.id == 'undefined')
    {
        genID.id = 0;
    } else {
        ++genID.id;
    }
    return genID.id;
}